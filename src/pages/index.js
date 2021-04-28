import * as React from "react"
import { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import Img from "gatsby-image"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata?.title || `Title`
    const posts = data.allMarkdownRemark.nodes
    const categories = data.allMarkdownRemark.group

    const [tag, setTag] = useState("")
    const [rows, setRows] = useState([])
    const [size, setSize] = useState(5)
    const [page, setPage] = useState(1)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
      document.addEventListener("scroll", scrollToLoad)
      getPosts();
      return () => (
        document.removeEventListener("scroll", scrollToLoad)
      )
    }, [])
  
    useEffect(async () => {
      if (!fetching) return;
      await getPosts();
    }, [fetching]);
  
    const getPosts = () => {
      setRows(posts.map((post, index) => {
        if(index < size) return post
      }))
      setFetching(false);
    }

    const scrollToLoad = async (e) => {
      const dh = document.getElementsByTagName("html")[0].scrollHeight;
      const dch = document.getElementsByTagName("html")[0].clientHeight;
      const dct = document.getElementsByTagName("html")[0].scrollTop;
      if (dh === (dch+dct)) {
        setPage(page + 1);
        setSize(size + 5);
        setFetching(true);
      }
    };
  
    // 작성된 게시글이 없을 때
    if (posts.length === 0) {
        return (
            <Layout location={location} title={siteTitle}>
                <Seo title="All posts" />
            </Layout>
        )
    }

    // 작성된 게시글이 있을 때
    return (
        <Layout location={location} title={siteTitle}>
            <Seo title="All posts" />
            <div className='lc-categories'>
                <button className={tag ? '':'lc-active'} onClick={() => setTag('')}>Home</button>
                {categories.map((category,index) => {
                    return (
                        <button
                            className={tag ===category.fieldValue? 'lc-active':''}
                            key={index}
                            onClick={() => setTag(category.fieldValue)}>
                            {category.fieldValue}
                        </button>
                    )
                })}
            </div>
            {tag ?
                <div className='lc-search-post-top'>
                    <span>{tag}</span>
                    <i>게시물 {rows.filter((post) => tag === post.frontmatter.tag).length} 개</i>
                </div>
            : null}
            <ol className='lc-post-list'>
                {rows.length && rows.filter((post) => tag === "" ? post : tag === post.frontmatter.tag).map(post => {
                    const title = post.frontmatter.title || post.fields.slug
                    const thumbnail = post.frontmatter.thumbnail ? post.frontmatter.thumbnail?.childImageSharp?.fluid : null
                    return (
                        <li key={post.fields.slug}>
                            <Link to={post.fields.slug} itemProp="url">
                                <article
                                    className="post-list-item"
                                    itemScope
                                    itemType="http://schema.org/Article"
                                >

                                    {thumbnail &&
                                    <div className="lc-post-thumb">
                                        <Img fluid={[
                                            thumbnail,
                                            {
                                                ...thumbnail,
                                                media: `(min-width: 800px)`
                                            }
                                        ]}/>
                                    </div>
                                    }
                                    <div className="lc-post-cont">
                                        <header>
                                            <small>{post.frontmatter.date}</small>
                                            <h2>
                                                <span itemProp="headline">{title}</span>
                                            </h2>
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
                    )
                })}
            </ol>
        </Layout>
    )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      group(field: frontmatter___tag) {
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
          tag
          writter
          thumbnail {
            childImageSharp {
              fluid(maxWidth: 400) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
