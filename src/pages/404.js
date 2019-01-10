import React from 'react'
import Layout from '../components/Layout'

const NotFoundPage = () => (
  <Layout>
    <div className="overflow-hidden">
    <div className="container d-flex align-items-stretch ui-mh-100vh p-0">
      <div className="row w-100">
        <div className="d-flex col-md justify-content-center align-items-center order-2 order-md-1 position-relative p-5">
          <div className="error-bg-skew bg-white"></div>

          <div className="text-md-left text-center">
            <h1 className="display-2 font-weight-bolder mb-4">Whoops...</h1>
            <div className="text-xlarge font-weight-light mb-5">We couldn't find the page<br> you are looking for :(</div>
            <button type="button" className="btn btn-primary">←&nbsp; Go Back</button>
          </div>
        </div>

        <div className="d-flex col-md-5 justify-content-center align-items-center order-1 order-md-2 text-center text-white p-5">
          <div>
            <div className="error-code font-weight-bolder mb-2">404</div>
            <div className="error-description font-weight-light">Not Found</div>
          </div>
        </div>

      </div>
    </div>
  </div>
  </Layout>
)

export default NotFoundPage
