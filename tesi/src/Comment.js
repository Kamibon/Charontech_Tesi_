import React from 'react';


class Comment extends React.Component {

    



    


render(props) {
    


    return (
        <div className="commento"   >
            <pre><div> <em>{this.props.user}</em> : {this.props.testo} </div></pre>

    </div>
    )
}
    //ReactDOM.render(<Page />, document.getElementById('root'));
}
export { Comment};