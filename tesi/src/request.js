import React from "react";

class Request extends React.Component {


    


   

    render() {
        return (
            <div className="request" data-testo={this.props.testo} onClick={this.props.onClick }>
                <span className = "text1"> { this.props.testo}</span>

            </div>
        )


    }

}

export { Request };