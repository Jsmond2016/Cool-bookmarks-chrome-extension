import React from 'react';
import './layoutContainer.css';
import { Layout } from 'antd';
import { Route, Routes, Navigate } from 'react-router';
import Bookmarks from './views/bookmarks';
import NotFind from './views/not-find';

import MenuContainer from './menu/index';

const { Content, Header, Sider, Footer } = Layout;

const LayoutContainer: React.FC = () => {
  return (
    <Layout className="LayoutContainer" hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}>
        <MenuContainer />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="margin-[0px] text right text-white">
          <span>
            <a href="https://github.com/Jsmond2016/Cool-bookmarks-chrome-extension" target="_blank" rel="noreferrer">
              github
            </a>
          </span>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Routes>
            <Route path="/" element={<Navigate replace to="bookmarks" />}></Route>
            {/* <Route path="/setting" element={<Setting />}></Route> */}
            <Route path="bookmarks" element={<Bookmarks />}></Route>
            {/* <Route path="sections" element={<Sections />}></Route> */}
            <Route path="*" element={<NotFind />}></Route>
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutContainer;
