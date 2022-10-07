import icon from "../static/img/home.png";

const HomeIcon: React.FC = (): React.ReactElement => {
  return (
    <a href="/personal" className="home">
      <img src={icon} alt="Home" width="50" />
    </a>
  );
};

export default HomeIcon;
