// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Space, Layout } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
//import '../styles/Home.css';
import AOS from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChalkboardTeacher, faBook, faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/all.min.css';
import background from '../assets/background.jpg'; 

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Header style={{ background: '#ffffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                E-LEARNING FJKM
              </Title>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Accueil</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">Cours</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">À propos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </Header>

    <Layout style={{ 
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), 
                  url(${background}) no-repeat center center fixed`,
      backgroundSize: 'cover'
    }}>
      <Content style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        padding: '2rem',
        margin: '2rem',
        borderRadius: '8px'
      }}>
        {/* Votre contenu */}
        <div className="container">
          <div style={{ textAlign: 'center', padding: '5rem 0' }} data-aos="fade-up">
            <Title level={1} style={{ marginBottom: '1rem' }}>
              E-LEARNING <br />
              Oniverity FJKM Ravelojaona
            </Title>
            <Paragraph style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
              "Dia ho ataon'ny Jehovah ho lohany ianao fa tsy ho rambony"
            </Paragraph>

            <Space size="large" style={{ marginTop: '2rem' }}>
              <Link to="/login-student">
                <Button type="primary" size="large" icon={<FontAwesomeIcon icon={faGraduationCap} />}>
                  Étudiant
                </Button>
              </Link>
              <Link to="/login-teacher">
                <Button type="default" size="large" icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}>
                  Enseignant
                </Button>
              </Link>
            </Space>
          </div>

          {/* Features Section */}
          <div className="row my-5 py-5" data-aos="fade-up">
            <div className="col-md-4 text-center mb-4">
              <FontAwesomeIcon icon={faBook} size="3x" className="mb-3 text-primary" />
              <h3>Cours en ligne</h3>
              <p>Accédez à une variété de cours conçus pour votre réussite académique.</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" className="mb-3 text-primary" />
              <h3>Enseignants qualifiés</h3>
              <p>Apprenez avec des enseignants expérimentés et dévoués.</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <FontAwesomeIcon icon={faUsers} size="3x" className="mb-3 text-primary" />
              <h3>Communauté</h3>
              <p>Rejoignez une communauté d'apprentissage dynamique.</p>
            </div>
          </div>
        </div>
      </Content>
    </Layout>


      {/* Footer */}
      <Footer style={{ background: '#001529', color: '#fff', padding: '3rem 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5>E-LEARNING FJKM</h5>
              <p>Plateforme d'apprentissage en ligne de l'Université FJKM Ravelojaona.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h5>Liens rapides</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-light">Accueil</Link></li>
                <li><Link to="/courses" className="text-light">Cours</Link></li>
                <li><Link to="/about" className="text-light">À propos</Link></li>
                <li><Link to="/contact" className="text-light">Contact</Link></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5>Contact</h5>
              <p><FontAwesomeIcon icon={faEnvelope} className="me-2" /> contact@fjkm-learning.edu</p>
            </div>
          </div>
          <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="mb-0">&copy; {new Date().getFullYear()} E-LEARNING FJKM Ravelojaona. Tous droits réservés.</p>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Home;