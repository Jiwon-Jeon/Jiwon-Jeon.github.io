import * as React from "react"
import {useState} from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata?.title || `Title`
    const posts = data.allMarkdownRemark.nodes
    const categories = data.allMarkdownRemark.group

    const [tag, setTag] = useState("")

    // 작성된 게시글이 있을 때
    if (posts.length === 0) {
        return (
            <Layout location={location} title={siteTitle}>
                <Seo title="All posts" />
                <div className='lc-header-text'>
                    <p>Linco Developer Page</p>
                    <p>Creative Idea,Design and Develop for you 마음 속의 아이디어를 현실로 잇는 창조의 링크.</p>
                </div>
            </Layout>
        )
    }

    // 작성된 게시글이 없을 때
    return (
        <Layout location={location} title={siteTitle}>
            <Seo title="All posts" />
            <div className='lc-categories'>
                <button onClick={() => setTag('')}>Home</button>
                {categories.map((category) => {
                    return (<button onClick={() => setTag(category.fieldValue)}>{category.fieldValue}</button>)
                })}
            </div>
            <ol className='lc-post-list'>
                {posts.filter((post) => tag === "" ? post : tag === post.frontmatter.tag).map(post => {
                    const title = post.frontmatter.title || post.fields.slug

                    return (
                        <li key={post.fields.slug}>
                            <article
                                className="post-list-item"
                                itemScope
                                itemType="http://schema.org/Article"
                            >
                                <header>
                                    <h2>
                                        <Link to={post.fields.slug} itemProp="url">
                                            <span itemProp="headline">{title}</span>
                                        </Link>
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
                            </article>
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
        }
      }
    }
  }
`
