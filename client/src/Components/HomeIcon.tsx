// import icon from "../static/img/home.png";

const HomeIcon: React.FC = (): React.ReactElement => {
  return (
    <a href="/personal" className="home-btn">
      <div className="home-btn__icon">Home</div>
      {/* <img src={icon} alt="Home" width="50" /> */}
    </a>
  );
};

export default HomeIcon;
