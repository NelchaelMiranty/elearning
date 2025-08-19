import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Modal, Upload, message, Card, List, Divider, Typography, Tabs, Input, Badge, Avatar } from 'antd';
import { 
  DeleteOutlined, FilePptOutlined, CloseOutlined, PlusOutlined, FileOutlined, 
  LeftOutlined, RightOutlined, UserOutlined, AudioOutlined, AudioMutedOutlined, 
  MessageOutlined, MoreOutlined, ArrowRightOutlined 
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// -------- CourseDetail --------

const CourseDetail = ({ onPresentationCreated }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showFileWindow, setShowFileWindow] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "Chapitre 1.pdf", url: "#" },
    { name: "Chapitre 2.pptx", url: "#" },
    { name: "Exercices.docx", url: "#" },
  ]);

  const courses = [
    { title: "Resaux", content: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." },
    { title: "TCP/IP", content: "Body text for whatever you'd like to say. takeaway points, quotes, anecdotes, or short story." }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      const fileWindow = document.querySelector('.file-window-container');
      const fileButton = document.querySelector('.file-button');
      if (showFileWindow && fileWindow && !fileWindow.contains(e.target)) {
        if (fileButton && !fileButton.contains(e.target)) setShowFileWindow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFileWindow]);

  const handleCreateClick = (course) => {
    setActiveCourse(course);
    setModalVisible(true);
    setPptFile(null);
    setIsSubmitDisabled(true);
  };

  const beforeUpload = (file) => {
    const isPPT = file.type === 'application/vnd.ms-powerpoint' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    if (!isPPT) {
      message.error('Seuls les fichiers PowerPoint (PPT/PPTX) sont acceptés !');
      return Upload.LIST_IGNORE;
    }
    setPptFile(file);
    setIsSubmitDisabled(false);
    return false;
  };

  const handleSubmit = () => {
    if (!pptFile) return;
    const url = URL.createObjectURL(pptFile);
    setUploadedFiles(prev => [...prev, { name: pptFile.name, url }]);
    onPresentationCreated({ name: pptFile.name, url });
    message.success("Présentation envoyée avec succès !");
    setModalVisible(false);
    setPptFile(null);
    setIsSubmitDisabled(true);
  };

  const handleDeleteFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <>
      <Card style={{ width: '100%', maxWidth: 800, border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'relative' }} bodyStyle={{ padding: 24 }}>
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
          <Button type="text" icon={<FileOutlined />} onClick={() => setShowFileWindow(!showFileWindow)} className="file-button" />
          <Button type="text" icon={<CloseOutlined />} onClick={() => setShowFileWindow(false)} aria-label="Fermer la fenêtre des fichiers" />
        </div>

        {showFileWindow && (
          <div
            className="file-window-container"
            style={{
              position: 'absolute', top: 60, right: 16, zIndex: 9, width: 320, maxHeight: 300,
              background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 4, overflowY: 'auto',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: showFileWindow ? 1 : 0,
              transform: showFileWindow ? 'translateY(0)' : 'translateY(-10px)'
            }}
          >
            <List
              size="small"
              header={<div style={{ fontWeight: 'bold', padding: '8px 16px' }}>Fichiers disponibles</div>}
              dataSource={uploadedFiles}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="text" icon={<DeleteOutlined />} danger size="small" onClick={() => handleDeleteFile(item.name)} />
                  ]}
                >
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </a>
                </List.Item>
              )}
            />
          </div>
        )}

        {courses.map((course, index) => (
          <React.Fragment key={index}>
            <Title level={index === 0 ? 2 : 3} style={{ fontSize: index === 0 ? 24 : 20, marginBottom: 16 }}>{course.title}</Title>
            <Paragraph style={{ marginBottom: 24 }}>{course.content}</Paragraph>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleCreateClick(course)} style={{ marginBottom: 24 }}>
              Créer une présentation
            </Button>
            {index < courses.length - 1 && <Divider style={{ margin: '24px 0' }} />}
          </React.Fragment>
        ))}
      </Card>

      <Modal
        title={`Nouvelle présentation - ${activeCourse?.title}`}
        visible={modalVisible}
        onCancel={() => { setModalVisible(false); setPptFile(null); setIsSubmitDisabled(true); }}
        footer={null}
        centered
        width={500}
        destroyOnClose
      >
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <Upload.Dragger
            name="file"
            multiple={false}
            accept=".ppt,.pptx"
            beforeUpload={beforeUpload}
            showUploadList={false}
            style={{ padding: '40px 0', marginBottom: 24, border: '2px dashed #d9d9d9' }}
          >
            <p className="ant-upload-drag-icon">
              <FilePptOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: 16 }}>
              {pptFile ? pptFile.name : "Glissez-déposez votre fichier PPT ici"}
            </p>
            <p className="ant-upload-hint" style={{ fontSize: 14 }}>
              {pptFile ? "Fichier prêt à être envoyé" : "Ou cliquez pour sélectionner un fichier"}
            </p>
          </Upload.Dragger>

          <Button type="primary" size="large" onClick={handleSubmit} disabled={isSubmitDisabled} style={{ width: '100%', backgroundColor: isSubmitDisabled ? '#f5f5f5' : '#1890ff', color: isSubmitDisabled ? '#d9d9d9' : 'white' }}>
            Soumettre
          </Button>
        </div>
      </Modal>
    </>
  );
};

// -------- SlideViewer --------

const SlideViewer = ({ slideUrl, onPrev, onNext }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
    {slideUrl ? (
      <img
        src={slideUrl}
        alt="Slide"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    ) : (
      <div style={{ color: '#999' }}>Aucune diapositive disponible</div>
    )}

    <Button icon={<LeftOutlined />} onClick={onPrev} style={{ position: 'absolute', left: 16 }} shape="circle" />
    <Button icon={<RightOutlined />} onClick={onNext} style={{ position: 'absolute', right: 16 }} shape="circle" />
  </div>
);

// -------- Chat --------

const Chat = ({ presentation }) => {
  const [students, setStudents] = useState([
    { id: 1, name: "Isaia", online: false },
    { id: 2, name: "Manea", online: true },
    { id: 3, name: "Simba", online: true },
    { id: 4, name: "Dairy", online: true },
    { id: 5, name: "Lokéa", online: true },
  ]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStudent, setActiveStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('public');
  const [showChat, setShowChat] = useState(true);
  const [unreadPrivate, setUnreadPrivate] = useState(0);

  const messagesEndRef = useRef(null);

  // Slides: si présentation, slide = url sinon slides par défaut
  const slides = presentation ? [presentation.url] : [
    "/slides/slide1.jpg",
    "/slides/slide2.jpg",
    "/slides/slide3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'private' && unreadPrivate > 0) setUnreadPrivate(0);
  };

  const handleStudentSelect = (student) => {
    setActiveStudent(student);
    setActiveTab('private');
    setShowChat(true);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0', padding: 16, overflow: 'auto' }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>Élèves en ligne</h2>
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
                borderRadius: 4,
                paddingLeft: 8
              }}
              onClick={() => handleStudentSelect(student)}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: student.online ? '#52c41a' : '#f5222d', marginRight: 12, flexShrink: 0 }} />
              <Avatar icon={<UserOutlined />} size="small" style={{ marginRight: 12, backgroundColor: student.online ? '#1890ff' : '#d9d9d9' }} />
              <span style={{ color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.name}</span>
              {activeTab === 'private' && activeStudent?.id === student.id && <Badge dot style={{ marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, lineHeight: '64px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              shape="circle"
              icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
              onClick={() => setIsMuted(!isMuted)}
              type={isMuted ? 'default' : 'primary'}
              size="middle"
            />
            <Button type="text" icon={<MessageOutlined />} onClick={() => setShowChat(!showChat)}>{showChat ? 'Masquer le chat' : 'Afficher le chat'}</Button>
          </div>
          <div style={{ fontWeight: 500, fontSize: 16, color: '#333' }}>{formatTime(timer)}</div>
          <Button type="text" icon={<MoreOutlined style={{ fontSize: 18 }} />} style={{ width: 40 }} />
        </Header>

        <Content style={{ padding: 24, background: '#f5f5f5', display: 'flex', gap: 16 }}>
          <div style={{ flex: showChat ? 2 : 1, height: 'calc(100vh - 172px)', transition: 'all 0.3s' }}>
            <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                <SlideViewer
                  slideUrl={slides[slideIndex]}
                  onPrev={() => setSlideIndex(i => Math.max(i - 1, 0))}
                  onNext={() => setSlideIndex(i => Math.min(i + 1, slides.length - 1))}
                />
              </div>
              <div style={{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, borderTop: '1px solid #f0f0f0' }}>
                <Button icon={<LeftOutlined />} shape="circle" size="large" onClick={() => setSlideIndex(i => Math.max(i - 1, 0))} />
                <span style={{ fontWeight: 500 }}>Slide {slideIndex + 1} / {slides.length}</span>
                <Button icon={<RightOutlined />} shape="circle" size="large" onClick={() => setSlideIndex(i => Math.min(i + 1, slides.length - 1))} />
              </div>
            </Card>
          </div>

          {showChat && (
            <div style={{ flex: 1, height: 'calc(100vh - 172px)', minWidth: 300, transition: 'all 0.3s' }}>
              <Card
                title={
                  <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ margin: '-16px -24px' }}>
                    <TabPane tab="Chat Public" key="public" />
                    <TabPane
                      tab={
                        <span>
                          Chat Privé
                          {unreadPrivate > 0 && <Badge count={unreadPrivate} style={{ marginLeft: 8 }} />}
                        </span>
                      }
                      key="private"
                    />
                  </Tabs>
                }
                bodyStyle={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 48px)' }}
              >
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: 8,
                    marginBottom: 8,
                    border: '1px solid #f0f0f0',
                    borderRadius: 4,
                    backgroundColor: '#fff'
                  }}
                >
                  {messages.filter(m => (activeTab === 'private' ? m.isPrivate : !m.isPrivate)).map(m => (
                    <div
                      key={m.id}
                      style={{
                        margin: '8px 16px',
                        alignSelf: m.sender === 'Vous' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        backgroundColor: m.sender === 'Vous' ? '#1890ff' : '#f0f0f0',
                        color: m.sender === 'Vous' ? 'white' : 'black',
                        borderRadius: 12,
                        padding: '8px 12px',
                        wordWrap: 'break-word'
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 'bold' }}>{m.sender}</div>
                      <div>{m.content}</div>
                      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'right', opacity: 0.6 }}>{m.time}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <Input.Search
                  placeholder={`Envoyer un message ${activeTab === 'private' && activeStudent ? `à ${activeStudent.name}` : ''}`}
                  enterButton="Envoyer"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onSearch={handleSendMessage}
                />
              </Card>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

// -------- Parent Component --------

const VirtualClassroom = () => {
  const [presentation, setPresentation] = useState(null);

  return (
    <div style={{ padding: 24, backgroundColor: '#e6f7ff', minHeight: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Classe Virtuelle</Title>
      <CourseDetail onPresentationCreated={setPresentation} />
      <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 24 }}>
        <Chat presentation={presentation} />
      </div>
    </div>
  );
};

export default VirtualClassroom;
