import React, { useState } from "react";
import { Link, graphql, StaticQuery } from "gatsby";
import Img from "gatsby-image"
import "../assets/index.scss";

const Search = (props) => {
    const emptyQuery = "";

    const [state, setState] = useState({
        filteredData: [],
        query: emptyQuery,
    });

    const handleInputChange = (event) => {
        const query = event.target.value;
        const { data } = props;
        const posts = data.allMarkdownRemark.edges || [];

        const filteredData = posts.filter((post) => {
            const { description, title, tags } = post.node.frontmatter;
            return (
                (description &&
                    description.toLowerCase().includes(query.toLowerCase())) ||
                (title && title.toLowerCase().includes(query.toLowerCase())) ||
                (tags && tags.join("").toLowerCase().includes(query))
            );
        });

        setState({
            query,
            filteredData,
        });
    };

    const renderSearchResults = () => {
        const { query, filteredData } = state;
        const hasSearchResults = filteredData && query !== emptyQuery;
        const posts = hasSearchResults ? filteredData : [];
        return (
            posts &&
            posts.map(({ node }) => {
                const { excerpt } = node;

                const { slug } = node.fields;
                const { date, description } = node.frontmatter;
                const title = node.frontmatter.title || node.fields.slug
                const thumbnail = node.frontmatter.thumbnail ? node.frontmatter.thumbnail?.childImageSharp?.fluid : null
                return (
                    <div key={node.fields.slug}>
                        <Link to={node.fields.slug} itemProp="url">
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
                                        <small>{node.frontmatter.date}</small>
                                        <h2>
                                            <span itemProp="headline">{title}</span>
                                        </h2>
                                    </header>
                                    <section>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: node.frontmatter.description || node.excerpt,
                                            }}
                                            itemProp="description"
                                        />
                                    </section>
                                </div>
                            </article>
                        </Link>
                    </div>
                );
            })
        );
    };

    return (
        <div className='lc-search-wrap'>
            <div>
                <div className="md-form">
                    <div className="search" />
                    <input
                        className="form-control form-control-sm ml-3 w-75"
                        type="text"
                        placeholder="Search"
                        aria-label="Search"
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            {state.query && (
                <div>
                    {renderSearchResults()}
                </div>
            )}
        </div>
    );
};

export default (props) => (
    <StaticQuery
        query={graphql`
      query {
        allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
          edges {
            node {
              excerpt(pruneLength: 200)
              id
              frontmatter {
                  title
                  date
                  tag
                  writter
                  thumbnail {
                        childImageSharp {
                          fluid(maxWidth: 400) {
                            base64
                            aspectRatio
                            src
                            srcSet
                            sizes
                          }
                        }
                      }
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `}
        render={(data) => <Search data={data} {...props} />}
    />
);