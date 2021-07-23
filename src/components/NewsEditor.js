import React, { Component } from 'react';
import Axios from 'axios';
import { NewsConfiguration } from '../constants.js';

class NewsEditor extends Component {

    constructor(props)
    {
        super(props);

        this.state =
        {
            listings : [],
            newsText : '',
            pageNumber : 0,
            maxPages : 0
        };

        this.readNews();
    }

    componentDidMount()
    {
        this.renderNews = this.renderNews.bind(this);
        this.readNews = this.readNews.bind(this);
        this.getNewsListings = this.getNewsListings.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handlePrevPage = this.handlePrevPage.bind(this);
        this.createArticle = this.createArticle.bind(this);
    }

    readNews() {
        Axios.get(NewsConfiguration.Txt_Location).then((response) => {
            console.log(response);
            let news = response.data;
            this.getNewsListings(news);
        });
    }

    newsListing() {
        var listing = {
            date: '',
            header:'',
            author:'',
            text:'',
        }
        return listing;
    }

    getNewsListings(text) {
        var newsListings = [];
        var parseDate = false;
        var parseIndex = 0;
        var parseHeading = false;
        var parseAuthor = false;
        var parseText = false;

        for(var textIndex = 0; textIndex < text.length; textIndex++) {

            var currentListing = newsListings.length-1;
            
            if (text[textIndex] === ']') {
                parseDate = true;
                parseIndex = 0;
                newsListings.push(this.newsListing());
                continue;
            }
            else if (text[textIndex] === '|') {
                if (parseAuthor) {
                    parseAuthor = false;
                    parseText = true;
                    continue;
                }

                parseHeading = !parseHeading;
                
                if (!parseHeading) {
                    parseAuthor = true;
                }
                continue;
            }
            else if(text[textIndex] === '[') {
                parseText = false;
            }

            if (parseDate) {
                newsListings[currentListing].date += text[textIndex];
                console.log(newsListings[currentListing].date);
                parseIndex++;
                if (parseIndex === NewsConfiguration.Date_Length) {
                    parseDate = false;
                }
            } else if (parseHeading) {
                newsListings[currentListing].header += text[textIndex];
            } else if (parseAuthor) {
                newsListings[currentListing].author += text[textIndex];
            } else if (parseText) {
                newsListings[currentListing].text += text[textIndex];
            } 
        }
        
        if(newsListings.length > 0) {
            this.setState({listings:newsListings});
        }
    }
    createArticle() {
        var listingsCollection = this.state.listings.slice();

        listingsCollection.push(this.newsListing());
        this.setState({listings : listingsCollection});
    }

    deleteArticle(index) {
        var listingsCollection = [];
        for (let i = 0; i < this.state.listings.length; i++) {
            if (i == index) {
                continue;
            }
            listingsCollection.push(this.state.listings[i]);
        }

        this.setState({listings : listingsCollection});
    }

    renderNews() {

        var listings = this.state.listings;
        var viewIndex = this.state.pageNumber*NewsConfiguration.Items_Per_Page;
        var pageEndIndex = viewIndex+NewsConfiguration.Items_Per_Page;

        if (pageEndIndex >= listings.length) {
            pageEndIndex = listings.length;
        }
        return (<div>
            
            <table cellSpacing='5%'>
            

            <tr>
                <td>{<img src='./images/prev_arrow.png' alt='Prev page' onClick={this.handlePrevPage}/>}</td>
                <td>{<img src='./images/next_arrow.png' alt='Next page' onClick={this.handleNextPage}/>}</td>
                <td><button onClick={this.createArticle}>New article</button></td>
                <td><button onClick={this.handleSubmit}>Confirm</button></td>
            </tr>
            </table>
            {listings.length > 0  ? listings.slice(viewIndex, pageEndIndex).map((listing,index) => 
                <div>
                <table border="5px" width='70%'>
                <tr>
                <td>
                <p>Heading: </p>
                <input value={listing.header} onChange={(e) => this.handleHeaderChange(e,index)}/>
                </td>
                <td>
                <p>Date: </p>
                <input value={listing.date} onChange={(e) => this.handleDateChange(e,index)}  maxLength='8'/>
                </td>
                </tr>
                <tr> 
                <p>Author:</p>
                <input value={listing.author} onChange={(e) => this.handleAuthorChange(e,index)}/>
                </tr>
                <tr>
                <td>
                <textarea value={listing.text} onChange={(e) => this.handleTextChange(e,index)} className='newsBox'/>
                </td>
                <td>
                    <button onClick={(e) => this.deleteArticle(index)}>Delete</button>
                </td>
                </tr>
                </table>
                </div>
            ) : null}
        </div>);
    }



    toText(listing) {
        var txt = '[0]';
        txt += listing.date +'|';
        txt += listing.header+'|';
        txt += listing.author+'|';
        txt += listing.text;
        return txt;
    }

    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.listings.length > 0) {
            alert('There isn\'t any news to save.');
            return;
        }
        var text = '';
        for (let i = 0; i < this.state.listings.length; i++) {
            text += this.toText(this.state.listings[i]);
        }

        const data = {
            txt : text
        }
        
        Axios.post('./access/updatenews.php',data).then((response) => {
            alert(response.data);
        });
    }

    handleTextChange(e,index) {
        this.setState(prevState => {
           prevState.listings[index].text = e.target.value;
           return {listings : prevState.listings};
        });
    }

    handleAuthorChange(e,index) {
        this.setState(prevState => {
           prevState.listings[index].author = e.target.value;
           return {listings : prevState.listings};
        });
    }

    handleDateChange(e,index) {
        this.setState(prevState => {
           prevState.listings[index].date = e.target.value;
           return {listings : prevState.listings};
        });
    }

    handleHeaderChange(e,index) {
        this.setState(prevState => {
           prevState.listings[index].header = e.target.value;
           return {listings : prevState.listings};
        });
    }
    
    handleNextPage() {
        this.setState(prevState => {
            return {pageNumber: prevState.pageNumber + 1 }
        });
    }

    handlePrevPage() {
        this.setState(prevState => {
            var number = prevState.pageNumber - 1;
            if (number < 0) {
                number = prevState.pageNumber;
            }
            return {pageNumber: number}
        });
    }

    render() {
        return this.renderNews();
    }
}

export default NewsEditor;