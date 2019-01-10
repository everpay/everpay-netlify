import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
<Section className="bg-white">
<div className="jumbotron ui-hero ui-mh-100vh ui-bg-cover ui-bg-fixed ui-bg-overlay-container text-white" style="background-image: url('assets/img/bg/21.jpg');">
    <div className="ui-bg-overlay bg-dark opacity-50"></div>
    <div className="container py-5 px-3">
      <div className="row pt-4">
        <div className="w-100">

          <div className="col-md-11 col-lg-8 col-xl-7 text-center mx-auto mb-5">
            <h1 className="display-3 font-secondary font-weight-bolder mb-4">User Analytics for Everyone</h1>
            <div className="lead opacity-75">
              No more manual data logging, maintaining tracking plans, custom ETL pipelines, or one-off report requests. Just insights.
            </div>
          </div>

          <div className="col-12 text-center">
            <a href="#" className="btn btn-lg btn-outline-white">Sign In with
              <strong>Facebook</strong>
            </a>
          </div>

          <div className="lead text-center opacity-50 mt-5 mb-4">
            <small>or sign up using form</small>
          </div>

          <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
            <div className="form-row">
              <div className="col-md mt-2 mt-lg-0">
                <input type="email" className="form-control form-control-lg form-control-inverted px-3" placeholder="E-mail">
              </div>
              <div className="col-md mt-2 mt-lg-0">
                <input type="password" className="form-control form-control-lg form-control-inverted px-3" placeholder="Password">
              </div>
              <div className="col-12 mt-2">
                <button type="button" className="btn btn-primary btn-block btn-lg font-weight-semibold">Try Now for Free</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>


  <div className="bg-white">

    <!-- Block -->
    <div className="landing-block pb-5">
      <div className="container px-3">        
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">Latest Stories</h1>
            </div>
            {posts
              .map(({ node: post }) => (
                <div
                  className="content"
                  style={{ border: '1px solid #333', padding: '2em 4em' }}
                  key={post.id}
                >
                  <p>
                    <Link className="has-text-primary" to={post.fields.slug}>
                      {post.frontmatter.title}
                    </Link>
                    <span> &bull; </span>
                    <small>{post.frontmatter.date}</small>
                  </p>
                  <p>
                    {post.excerpt}
                    <br />
                    <br />
                    <Link className="button is-small" to={post.fields.slug}>
                      Keep Reading →
                    </Link>
                  </p>
                </div>
              ))}
          </div>
        </section>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: { templateKey: { eq: "blog-post" } }}
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
