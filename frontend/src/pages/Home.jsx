import React from 'react'
import instance from '../axios';
import Content from '../components/Content'
import Main from '../components/Main';
import FeatureComponent from '../components/FeatureComponent';
import AdvantageComponent from '../components/AdvantageComponent';
import Description from '../components/Description'
import Envelope from '../components/Envelope'
import EndComponent from '../components/EndComponent'

const Home = ({ user, setUser }) => {

  // 로그아웃 함수
  const logout = async () => {
    console.log("로그아웃 함수");
    const res = await instance.get("/logout");
    console.log("logout res :", res.data);

    // sessionStorage 값 지우기
    sessionStorage.removeItem("info");

    setUser("");
    alert("다음에 또 방문해주세요 ~!");
  }

  // CSS 스타일 추가
  const contentStyle = {
    height: '100vh',
    overflowY: 'auto',
  };

  return (
    <div className="wt-page" id="page">
      <div className="wt-view" data-controller="homeController" id="view-main">
        <div className="wt-content" role="main" style={contentStyle}>
          <Main/>
          <Content/>
          <FeatureComponent/>
          <AdvantageComponent/>
          <Description/>
          <Envelope/>
          <EndComponent user={user} setUser={setUser}/>
        </div>
      </div>
    </div>
  )
}

export default Home