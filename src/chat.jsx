import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, Dropdown, Menu, Avatar, Button, Tooltip, Tabs, Input, 
  List, Badge, Card 
} from 'antd';
import { 
  MoreOutlined, LeftOutlined, RightOutlined, UserOutlined, 
  AudioOutlined, AudioMutedOutlined, MessageOutlined, 
  CloseOutlined, ArrowRightOutlined 
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;

const SlideViewer = ({ slideUrl, onPrev, onNext }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      {slideUrl ? (
        <img 
          src={slideUrl} 
          alt="Slide" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain'
          }} 
        />
      ) : (
        <div style={{ color: '#999' }}>Aucune diapositive disponible</div>
      )}
      
      <Button 
        icon={<LeftOutlined />}
        onClick={onPrev}
        style={{ position: 'absolute', left: 16 }}
        shape="circle"
      />
      <Button 
        icon={<RightOutlined />}
        onClick={onNext}
        style={{ position: 'absolute', right: 16 }}
        shape="circle"
      />
    </div>
  );
};

// Modification ici : ajout de la prop "presentation"
const Chat = ({ presentation }) => {
  // États principaux
  const [students, setStudents] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStudent, setActiveStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('public');
  const [showChat, setShowChat] = useState(true);
  const [unreadPrivate, setUnreadPrivate] = useState(0);

  // Références
  const messagesEndRef = useRef(null);

  // Ici on remplace le tableau statique par la présentation reçue en props
  // Si presentation est null ou undefined, on passe un tableau vide
  const slides = presentation?.slides || [];

  useEffect(() => {
    // Simuler des étudiants connectés
    setStudents([
      { id: 1, name: "Isaia", online: false },
      { id: 2, name: "Manea", online: true },
      { id: 3, name: "Simba", online: true },
      { id: 4, name: "Dairy", online: true },
      { id: 5, name: "Lokéa", online: true },
      { id: 6, name: "Tqo", online: true },
      { id: 7, name: "Jill", online: true },
      { id: 8, name: "Safely", online: true },
      { id: 9, name: "Menny", online: true },
      { id: 10, name: "Emmanuel", online: true },
      { id: 11, name: "Marinah", online: true },
      { id: 12, name: "Makha", online: true },
    ]);

    // Timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Quand la présentation change, on remet l'index à 0
  useEffect(() => {
    setSlideIndex(0);
  }, [presentation]);

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Menu déroulant
  const settingsMenu = (
    <Menu>
      <Menu.Item key="1">Paramètres audio</Menu.Item>
      <Menu.Item key="2" danger>Déconnexion</Menu.Item>
    </Menu>
  );

  // Envoyer un message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageObj = {
        id: Date.now(),
        sender: 'Vous',
        content: newMessage,
        time: new Date().toLocaleTimeString(),
        isPrivate: activeTab === 'private',
        recipient: activeTab === 'private' ? activeStudent?.name : null
      };

      setMessages([...messages, messageObj]);
      setNewMessage('');
      
      // Simuler une réponse pour le chat privé
      if (activeTab === 'private' && activeStudent) {
        setTimeout(() => {
          const replyObj = {
            id: Date.now() + 1,
            sender: activeStudent.name,
            content: `Réponse à votre message: "${newMessage}"`,
            time: new Date().toLocaleTimeString(),
            isPrivate: true
          };
          setMessages(prev => [...prev, replyObj]);
          setUnreadPrivate(prev => prev + 1);
        }, 1500);
      }
    }
  };

  // Changer d'onglet
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'private' && unreadPrivate > 0) {
      setUnreadPrivate(0);
    }
  };

  // Sélectionner un étudiant pour le chat privé
  const handleStudentSelect = (student) => {
    setActiveStudent(student);
    setActiveTab('private');
    setShowChat(true);
  };

  // Faire défiler vers le bas automatiquement
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Colonne gauche - Liste des élèves */}
      <Sider 
        width={280} 
        style={{ 
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          padding: '16px',
          overflow: 'auto'
        }}
      >
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#333'
        }}>
          Élèves en ligne
        </h2>
        
        <div style={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          {students.map(student => (
            <div 
              key={student.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: activeStudent?.id === student.id ? '#f5f5f5' : 'transparent',
                borderRadius: '4px',
                paddingLeft: '8px'
              }}
              onClick={() => handleStudentSelect(student)}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: student.online ? '#52c41a' : '#f5222d',
                marginRight: '12px',
                flexShrink: 0
              }} />
              
              <Avatar 
                icon={<UserOutlined />} 
                size="small" 
                style={{ 
                  marginRight: '12px',
                  backgroundColor: student.online ? '#1890ff' : '#d9d9d9'
                }} 
              />
              
              <span style={{ 
                color: '#333',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {student.name}
              </span>

              {activeTab === 'private' && activeStudent?.id === student.id && (
                <Badge dot style={{ marginLeft: 'auto' }} />
              )}
            </div>
          ))}
        </div>
      </Sider>

      {/* Zone principale */}
      <Layout>
        {/* En-tête avec microphone et menu */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
          lineHeight: '64px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Tooltip title={isMuted ? "Activer le microphone" : "Désactiver le microphone"}>
              <Button 
                shape="circle" 
                icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                onClick={() => setIsMuted(!isMuted)}
                type={isMuted ? 'default' : 'primary'}
                size="middle"
              />
            </Tooltip>

            <Button 
              type="text" 
              icon={<MessageOutlined />}
              onClick={() => setShowChat(!showChat)}
            >
              {showChat ? 'Masquer le chat' : 'Afficher le chat'}
            </Button>
          </div>
          
          <div style={{ 
            fontWeight: '500',
            fontSize: '16px',
            color: '#333'
          }}>
            {formatTime(timer)}
          </div>
          
          <Dropdown overlay={settingsMenu} trigger={['click']}>
            <Button 
              type="text" 
              icon={<MoreOutlined style={{ fontSize: '18px' }} />}
              style={{ width: '40px' }}
            />
          </Dropdown>
        </Header>

        {/* Contenu principal */}
        <Content style={{ 
          padding: '24px', 
          background: '#f5f5f5',
          display: 'flex',
          gap: '16px'
        }}>
          {/* Zone de présentation */}
          <div style={{ 
            flex: showChat ? 2 : 1,
            height: 'calc(100vh - 172px)',
            transition: 'all 0.3s'
          }}>
            <Card
              style={{ 
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              bodyStyle={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: 0
              }}
            >
              {/* Zone d'affichage du slide */}
              <div style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa'
              }}>
                <SlideViewer
                  slideUrl={slides[slideIndex]}
                  onPrev={() => setSlideIndex(i => Math.max(i - 1, 0))}
                  onNext={() => setSlideIndex(i => Math.min(i + 1, slides.length - 1))}
                />
              </div>

              {/* Barre de contrôle */}
              <div style={{ 
                padding: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <Button 
                  icon={<LeftOutlined />} 
                  shape="circle" 
                  size="large"
                  onClick={() => setSlideIndex(i => Math.max(i - 1, 0))}
                  disabled={slideIndex === 0}
                />
                
                <span style={{ fontWeight: '500' }}>
                  Slide {slideIndex + 1} / {slides.length || 0}
                </span>
                
                <Button 
                  icon={<RightOutlined />} 
                  shape="circle" 
                  size="large"
                  onClick={() => setSlideIndex(i => Math.min(i + 1, slides.length - 1))}
                  disabled={slideIndex === slides.length - 1 || slides.length === 0}
                />
              </div>
            </Card>
          </div>

          {/* Zone de chat (conditionnelle) */}
          {showChat && (
            <div style={{ 
              flex: 1,
              height: 'calc(100vh - 172px)',
              minWidth: '300px',
              transition: 'all 0.3s'
            }}>
              <Card
                title={
                  <Tabs 
                    activeKey={activeTab} 
                    onChange={handleTabChange}
                    style={{ margin: '-16px -24px' }}
                  >
                    <TabPane 
                      tab="Chat Public" 
                      key="public" 
                    />
                    <TabPane 
                      tab={
                        <span>
                          Chat Privé
                          {unreadPrivate > 0 && (
                            <Badge count={unreadPrivate} style={{ marginLeft: '8px' }} />
                          )}
                        </span>
                      } 
                      key="private" 
                    />
                  </Tabs>
                }
                extra={
                  <Button 
                    type="text" 
                    icon={<CloseOutlined />} 
                    onClick={() => setShowChat(false)}
                  />
                }
                style={{ height: '100%' }}
                bodyStyle={{
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(100% - 56px)'
                }}
              >
                {/* Messages */}
                <div style={{ 
                  flex: 1,
                  padding: '16px',
                  overflowY: 'auto',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <List
                    dataSource={messages.filter(m => 
                      (activeTab === 'public' && !m.isPrivate) || 
                      (activeTab === 'private' && m.isPrivate && 
                       (m.sender === activeStudent?.name || m.sender === 'Vous' || m.recipient === activeStudent?.name))
                    )}
                    renderItem={item => (
                      <List.Item style={{ 
                        padding: '8px 0',
                        border: 'none',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ 
                          backgroundColor: item.sender === 'Vous' ? '#e6f7ff' : '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          maxWidth: '80%'
                        }}>
                          <div style={{ 
                            fontWeight: 'bold',
                            color: item.sender === 'Vous' ? '#1890ff' : '#333'
                          }}>
                            {item.sender}
                          </div>
                          <div>{item.content}</div>
                          <div style={{ 
                            fontSize: '12px',
                            color: '#999',
                            textAlign: 'right'
                          }}>
                            {item.time}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div style={{ padding: '16px' }}>
                  {activeTab === 'private' && !activeStudent ? (
                    <div style={{ 
                      textAlign: 'center',
                      color: '#999',
                      padding: '16px 0'
                    }}>
                      Sélectionnez un élève pour chatter en privé
                    </div>
                  ) : (
                    <>
                      <TextArea
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={activeTab === 'public' 
                          ? "Écrire un message public..." 
                          : `Message à ${activeStudent?.name}...`}
                        onPressEnter={(e) => {
                          if (!e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        type="primary"
                        style={{ marginTop: '8px', float: 'right' }}
                        onClick={handleSendMessage}
                        icon={<ArrowRightOutlined />}
                      >
                        Envoyer
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;
