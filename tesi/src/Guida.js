import React from 'react';


class Guida extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            likes: [],
            liked: "Mi piace",
            thumb:""
        };
    }



    componentDidMount() {
        fetch("http://localhost:4200/api/guides/like/get/" + this.props.autore + "&" + this.props.titolo).then((response) => { return response.json() }).then((json) => this.checkLikes(json) );
        
    }

    checkLikes(json) {
        this.setState({ likes: json.message })
        if (json.message.length > 0) {
            for (let el of json.message) {
                if (localStorage.getItem("normalEmail")!=null)
                if (el.user === JSON.parse(localStorage.getItem("normalEmail")).username) {
                    this.setState({ liked: "Piaciuto" })
                   

                }
                
            }
        }

    }


render(props) {
    
     

    return (
        <div className="guida" onClick={(event)=>this.props.onClick(event)} data-autore={this.props.autore} data-titolo={this.props.titolo} data-testo={this.props.testo} data-liked={this.state.liked }   >
            <div className="titolo"> {this.props.titolo}<br /></div>
            <div className="testo">{this.props.testo} </div> 
            <div className="interactions">
                <span>Mi piace : {this.state.likes.length}</span> 
               
            </div>

    </div>
    )
}
    //ReactDOM.render(<Page />, document.getElementById('root'));
}
export { Guida };