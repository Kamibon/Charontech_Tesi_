import React from "react";

class Advice extends React.Component {


   

    removeAdvice() {
        
        fetch("http://localhost:4200/api/writers/suggestions/remove/" + this.props.user + "&" + this.props.sub);
        dispatchEvent(new Event("remove"));
    }


    render() {
        return (
            <div className="advice">
                <div className="text1"> L'utente {this.props.user} suggerisce di cambiare "{this.props.testo}" con "{this.props.sub}"</div>
                <input type="checkbox" onClick={()=>this.removeAdvice() } ></input>
            </div>
        )


    }

}

export { Advice };