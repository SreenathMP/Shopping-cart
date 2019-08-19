/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import "./Styles/Items.css";
import GetBooks from "../ApiCalls/GetBooks";
import Paginator from "./Paginator";
import { AddtoCart } from "../../actions";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

function mapDispatchToProps(dispatch) {
  return {
    addItems: item => dispatch(AddtoCart(item))
  };
}

class BookItems extends Component {
  constructor() {
    super();
    this.bookList = new GetBooks();
    this.onChangePage = this.onChangePage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  title_max = 35;
  author_max = 20;
  state = { Books: [], pageOfItems: [] };

  componentDidMount() {
    this.bookList.GetBooks().then(books => {
      this.setState({
        Books: books.sort((a, b) => (a.title > b.title ? 1 : -1))
      });
    });
  }
  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  handleClick = e => {
    e.preventDefault();

    const index = e.target.getAttribute("data-index");
    const bookID=parseInt(index);
    const { Books } = this.state;
    const bookIndx=Books.map((o) => o.bookID).indexOf(bookID);
    const quantity = 1;
    const item = { ...Books[bookIndx], quantity };
    this.props.addItems(item);

    this.props.history.push(`/cart/`);
  };

  render() {
    return (
      <div className="container">
        <div className="row" style={{ margin: "20px" }}>
          {this.state.pageOfItems.map((book, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12">
              <figure className="card card-product">
                <div className="img-wrap">
                  <img src="images/items/harry.jpg" />
                </div>
                <figcaption className="info-wrap">
                  {book.title.length > this.title_max ? (
                    <h4>
                      <Link
                        to={{
                          pathname: `/book/${book.title}`
                        }}
                      >{`${book.title.substring(0, this.title_max)}...`}</Link>
                    </h4>
                  ) : (
                    <h4 className="title">
                      <Link
                        to={{
                          pathname: `/book/${book.title}`
                        }}
                      >
                        {book.title}
                      </Link>
                    </h4>
                  )}

                  {book.language_code === "eng" ||
                  book.language_code === "en-US" ? (
                    <div className="label-details">{"English,"}</div>
                  ) : (
                    <div className="label-details">
                      {book.language_code + ","}
                    </div>
                  )}
                  {book.authors.length > this.author_max ? (
                    <div className="label-details">{`${book.authors.substring(
                      0,
                      this.author_max
                    )}...`}</div>
                  ) : (
                    <div className="label-details">{book.authors}</div>
                  )}
                  <div className="rating-wrap">
                    <ul className="rating-stars">
                      <li style={{ width: "80%" }} className="stars-active">
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                      </li>
                      <li>
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                      </li>
                    </ul>
                    <div className="label-rating">
                      {book.ratings_count + " reviews"}
                    </div>
                  </div>
                </figcaption>
                <div className="bottom-wrap">
                  <a
                    href=""
                    className="btn btn-sm btn-primary float-right"
                    onClick={this.handleClick}
                    data-index={book.bookID}
                  >
                    ADD TO CART
                  </a>
                  <div className="price-wrap h5">
                    <span className="price-new">${book.price}</span>{" "}
                  </div>
                </div>
              </figure>
            </div>
          ))}

          <Paginator
            items={this.state.Books}
            onChangePage={this.onChangePage}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(BookItems)
);