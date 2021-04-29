import * as React from 'react';
import {useState, useEffect} from 'react';
import {Link, graphql} from 'gatsby';
import {parse} from 'query-string';
import {globalHistory} from '@reach/router';

import Img from 'gatsby-image';
//import Bio from '../components/bio';
import Layout from '../components/layout';
import Seo from '../components/seo';

const DEFAULT_STATE = {
    searchText: {
        filteredData: [],
        query: '',
    },
    category: parse(globalHistory.location.search)?.category || '',
    rows: [],
    size: 5,
    page: 1,
    fetching: true,
};

const BlogIndex = ({data, location}) => {
    const siteTitle = data.site.siteMetadata?.title || `Title`;
    const posts = data.allMarkdownRemark.nodes;
    const categories = data.allMarkdownRemark.group;

    const [searchText, setSearchText] = useState(DEFAULT_STATE.searchText);
    const [category, setCategory] = useState(DEFAULT_STATE.category);
    const [rows, setRows] = useState(DEFAULT_STATE.rows);
    const [size, setSize] = useState(DEFAULT_STATE.size);
    const [page, setPage] = useState(DEFAULT_STATE.page);
    const [fetching, setFetching] = useState(DEFAULT_STATE.fetching);

    useEffect(() => {
        if (!fetching) return;
        document.addEventListener('scroll', scrollToLoad);
        getPosts();
        return () => document.removeEventListener('scroll', scrollToLoad);
    }, [fetching]);

    const getPosts = () => {
        setRows(
            posts.map((post, index) => {
                if (index < size) return post;
            }),
        );
        setFetching(false);
    };

    const goHome = () => {
        setSearchText(DEFAULT_STATE.searchText);
        setCategory(DEFAULT_STATE.category);
        setRows(DEFAULT_STATE.rows);
        setSize(DEFAULT_STATE.size);
        setPage(DEFAULT_STATE.page);
        setFetching(DEFAULT_STATE.fetching);
    };

    const handleInputChange = event => {
        const query = event.target.value;
        setSearchText({query});
    };

    const filterData = e => {
        e.preventDefault();
        const {query} = searchText;
        if (query) {
            const filteredData = posts.filter(post => {
                const {title, category, tags} = post.frontmatter;
                return (
                    (title && title.toLowerCase().includes(query.toLowerCase())) ||
                    (category && category.toLowerCase().includes(query)) ||
                    (tags && tags.toLowerCase().includes(query))
                );
            });
            setRows(filteredData);
        } else {
            goHome();
        }
    };

    const scrollToLoad = async e => {
        const dh = document.getElementsByTagName('html')[0].scrollHeight;
        const dch = document.getElementsByTagName('html')[0].clientHeight;
        const dct = document.getElementsByTagName('html')[0].scrollTop;
        if (dh === dch + dct) {
            setPage(page + 1);
            setSize(size + 5);
            setFetching(true);
        }
    };

    // 작성된 게시글이 없을 때
    if (posts.length === 0) {
        return (
            <Layout location={location} title={siteTitle} goHome={goHome}>
                <Seo title="All posts" />
            </Layout>
        );
    }

    // 작성된 게시글이 있을 때
    return (
        <Layout location={location} title={siteTitle} goHome={goHome}>
            <Seo title="All posts" />
            <div className="lc-search-wrap">
                <form onSubmit={e => filterData(e)}>
                    <input
                        className="lc-src-input"
                        type="text"
                        placeholder="Search"
                        aria-label="Search"
                        onChange={handleInputChange}
                    />
                    <button className="lc-src-btn" type="submit" />
                </form>
            </div>

            <div className="lc-categories">
                <Link to={`/?category=`} className={category ? '' : 'lc-active'} onClick={() => setCategory('')}>
                    Home
                </Link>
                {categories && categories.length
                    ? categories.map((categoryItem, index) => {
                          return (
                              <Link
                                  to={`/?category=${categoryItem.fieldValue}`}
                                  key={index}
                                  className={category === categoryItem.fieldValue ? 'lc-active' : ''}
                                  onClick={() => setCategory(categoryItem.fieldValue)}
                              >
                                  {categoryItem.fieldValue}
                              </Link>
                          );
                      })
                    : null}
            </div>
            {category ? (
                <div className="lc-search-post-top">
                    <span>{category}</span>
                    <i>게시물 {rows.filter(post => category === post.frontmatter.category).length} 개</i>
                </div>
            ) : null}
            <ol className="lc-post-list">
                {rows && rows.length
                    ? rows
                          .filter(post => (category === '' ? post : category === post.frontmatter.category))
                          .map(post => {
                              const title = post.frontmatter.title || '제목 없음';
                              const thumbnail = post.frontmatter.thumbnail
                                  ? post.frontmatter.thumbnail?.childImageSharp?.fluid
                                  : null;
                              return (
                                  <li key={post.fields.slug}>
                                      <Link to={post.fields.slug} itemProp="url">
                                          <article
                                              className="post-list-item"
                                              itemScope
                                              itemType="http://schema.org/Article"
                                          >
                                              {thumbnail && (
                                                  <div className="lc-post-thumb">
                                                      <Img fluid={[thumbnail]} />
                                                  </div>
                                              )}
                                              <div className="lc-post-cont">
                                                  <header>
                                                      <span className="lc-post-category">
                                                          {post.frontmatter.category}
                                                      </span>
                                                      <h2>
                                                          <span itemProp="headline">{title}</span>
                                                      </h2>
                                                      <small>{post.frontmatter.date}</small>
                                                  </header>
                                                  <section>
                                                      <div
                                                          dangerouslySetInnerHTML={{
                                                              __html: post.frontmatter.description || post.excerpt,
                                                          }}
                                                          itemProp="description"
                                                      />
                                                  </section>
                                              </div>
                                          </article>
                                      </Link>
                                  </li>
                              );
                          })
                    : null}
            </ol>
        </Layout>
    );
};

export default BlogIndex;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
            group(field: frontmatter___category) {
                fieldValue
            }
            nodes {
                excerpt
                fields {
                    slug
                }
                frontmatter {
                    date(formatString: "MMMM DD, YYYY")
                    title
                    description
                    tags
                    category
                    writer
                    thumbnail {
                        childImageSharp {
                            fluid(maxWidth: 600, quality: 100) {
                                base64
                                aspectRatio
                                src
                                srcSet
                                sizes
                            }
                        }
                    }
                }
            }
        }
    }
`;
