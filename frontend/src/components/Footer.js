const Footer = () => {
    const footerStyle = {
        color: "green", fontStyle: "italic", fontSize: 16
    };
    return (<div style={footerStyle}>
        <br/>
        <em>Prije upotrebe pažljivo pročitati uputu o lijeku. Za obavijesti o indikacijama, mjerama opreza i nuspojavama upitajte svog liječnika ili ljekarnika.</em>
    </div>);
};

export default Footer;