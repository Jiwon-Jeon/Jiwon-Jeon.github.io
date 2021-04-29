import * as React from 'react';
import {Disqus} from 'gatsby-plugin-disqus';
import {Link, graphql} from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import Seo from '../components/seo';

import '../assets/index.scss';

const BlogPostTemplate = ({data, location}) => {
    const post = data.markdownRemark;
    const id = data.markdownRemark.id;
    const siteTitle = data.site.siteMetadata?.title || `Title`;
    const {previous, next} = data;
    const disqusConfig = {
        identifier: id,
        title: post.title,
    };

    return (
        <Layout location={location} title={siteTitle}>
            <Seo
                title={post.frontmatter.title}
                description={post.frontmatter.description || post.excerpt}
            />
            <article
                id="post"
                className="blog-post"
                itemScope
                itemType="http://schema.org/Article"
            >
                <header className="lc-post-header">
                    <div className="lc-post-category">
                        {post.frontmatter.category}
                    </div>
                    <h1 className="lc-post-title" itemProp="headline">
                        {post.frontmatter.title}
                        {console.log('tags', post.frontmatter.tags)}
                    </h1>
                    <div className="lc-post-info">
                        <small>{post.frontmatter.date}</small>
                    </div>
                </header>
                {/*<p>{post.frontmatter.writer}님의 글입니다</p>*/}
                <section
                    dangerouslySetInnerHTML={{__html: post.html}}
                    itemProp="articleBody"
                />
                <div className="lc-tag-wrap">
                    {post.frontmatter.tags
                        ? post.frontmatter.tags
                              .split('#')
                              .map((tagItem, tagIndex) => {
                                  if (tagIndex > 0) {
                                      return (
                                          <span className="lc-post-tag">
                                              #{tagItem}
                                          </span>
                                      );
                                  }
                              })
                        : null}
                </div>
                <footer className="lc-post-footer">
                    <Bio writer={post.frontmatter.writer} />
                    <Disqus config={disqusConfig} />
                </footer>
            </article>
            <nav className="blog-post-nav">
                <ul>
                    <li>
                        {previous && (
                            <span>
                                <i>이전 글</i>
                                <Link to={previous.fields.slug} rel="prev">
                                    {previous.frontmatter.title}
                                </Link>
                            </span>
                        )}
                    </li>
                    <li>
                        {next && (
                            <span>
                                <i>다음 글</i>
                                <Link to={next.fields.slug} rel="next">
                                    {next.frontmatter.title}
                                </Link>
                            </span>
                        )}
                    </li>
                </ul>
            </nav>
        </Layout>
    );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBySlug(
        $id: String!
        $previousPostId: String
        $nextPostId: String
    ) {
        site {
            siteMetadata {
                title
            }
        }
        markdownRemark(id: {eq: $id}) {
            id
            excerpt(pruneLength: 160)
            html
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
                description
                category
                tags
                writer
            }
        }
        previous: markdownRemark(id: {eq: $previousPostId}) {
            fields {
                slug
            }
            frontmatter {
                title
            }
        }
        next: markdownRemark(id: {eq: $nextPostId}) {
            fields {
                slug
            }
            frontmatter {
                title
            }
        }
    }
`;
