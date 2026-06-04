import { useEffect, useMemo, useState } from 'react';
import { Car, Search, User, PlusCircle, MessageCircle, Handshake, LogOut, ShieldCheck, Gauge, MapPin, Wallet } from 'lucide-react';
import { db } from './services/storage';
import { marketTable } from './data/seed';

const currency = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function Header({ page, setPage, user, logout }) {
  return <header className="topbar">
    <button className="brand" onClick={() => setPage('home')}><Car /> AutoTroca</button>
    <nav>
      <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>Carros</button>
      <button onClick={() => setPage('create')}>Anunciar</button>
      {user && <button onClick={() => setPage('dashboard')}>Painel</button>}
      {!user ? <button className="primary" onClick={() => setPage('auth')}>Entrar</button> : <button onClick={logout}><LogOut size={18}/> Sair</button>}
    </nav>
  </header>;
}

function Home({ cars, setPage, setSelectedCar }) {
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [tradeOnly, setTradeOnly] = useState(false);

  const filtered = useMemo(() => cars.filter(car => {
    const text = `${car.model} ${car.brand} ${car.city}`.toLowerCase();
    const matchText = text.includes(query.toLowerCase());
    const matchPrice = !maxPrice || car.price <= Number(maxPrice);
    const matchTrade = !tradeOnly || car.acceptsTrade;
    return matchText && matchPrice && matchTrade;
  }), [cars, query, maxPrice, tradeOnly]);

  return <main>
    <section className="hero">
      <div>
        <span className="badge"><ShieldCheck size={16}/> Plataforma segura para negociar</span>
        <h1>Compre, venda ou troque seu carro com proposta direta.</h1>
        <p>Site moderno com anúncios, comparação de preço de mercado, propostas, painel do usuário e mensagens.</p>
        <div className="searchbox">
          <Search />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por modelo, marca ou cidade" />
        </div>
      </div>
    </section>

    <section className="filters">
      <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Preço máximo" />
      <label><input type="checkbox" checked={tradeOnly} onChange={e => setTradeOnly(e.target.checked)} /> Aceita troca</label>
      <span>{filtered.length} carros encontrados</span>
    </section>

    <section className="grid">
      {filtered.map(car => <CarCard key={car.id} car={car} onClick={() => { setSelectedCar(car); setPage('details'); }} />)}
    </section>
  </main>;
}

function CarCard({ car, onClick }) {
  const diff = car.price - car.marketPrice;
  return <article className="card">
    <img src={car.image} alt={car.model} />
    <div className="cardBody">
      <div className="row between"><h3>{car.model}</h3><span className={diff <= 0 ? 'good' : 'warn'}>{diff <= 0 ? 'Bom preço' : 'Acima mercado'}</span></div>
      <p className="muted"><MapPin size={15}/> {car.city}</p>
      <div className="specs"><span>{car.year}</span><span><Gauge size={15}/> {Number(car.km).toLocaleString('pt-BR')} km</span><span>{car.acceptsTrade ? 'Aceita troca' : 'Venda'}</span></div>
      <strong className="price">{currency(car.price)}</strong>
      <small>Preço de mercado: {currency(car.marketPrice)}</small>
      <button className="primary full" onClick={onClick}>Ver detalhes</button>
    </div>
  </article>;
}

function Auth({ users, setUsers, setUser, setPage }) {
  const [mode, setMode] = useState('login');
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (mode === 'register') {
      if (users.some(u => u.email === data.email)) return alert('E-mail já cadastrado.');
      const newUser = { id: Date.now(), name: data.name, email: data.email, password: data.password };
      const updated = [...users, newUser];
      setUsers(updated); db.saveUsers(updated); db.setLoggedUser(newUser); setUser(newUser); setPage('home');
    } else {
      const found = users.find(u => u.email === data.email && u.password === data.password);
      if (!found) return alert('E-mail ou senha inválidos.');
      db.setLoggedUser(found); setUser(found); setPage('home');
    }
  }
  return <main className="centerPage"><form className="panel form" onSubmit={submit}>
    <h2>{mode === 'login' ? 'Entrar na conta' : 'Criar conta'}</h2>
    {mode === 'register' && <input name="name" placeholder="Nome completo" required />}
    <input name="email" type="email" placeholder="E-mail" required />
    <input name="password" type="password" placeholder="Senha" required />
    <button className="primary full">{mode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
    <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Criar uma conta' : 'Já tenho conta'}</button>
  </form></main>;
}

function CreateAd({ user, cars, setCars, setPage }) {
  function submit(e) {
    e.preventDefault();
    if (!user) return alert('Faça login para anunciar.');
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const marketPrice = marketTable[d.model] || Number(d.price);
    const car = { id: Date.now(), ownerId: user.id, ownerName: user.name, model: d.model, brand: d.brand, year: Number(d.year), km: Number(d.km), city: d.city, price: Number(d.price), marketPrice, acceptsTrade: d.acceptsTrade === 'on', image: d.image, description: d.description };
    const updated = [car, ...cars]; setCars(updated); db.saveCars(updated); setPage('dashboard');
  }
  return <main className="centerPage"><form className="panel form wide" onSubmit={submit}>
    <h2>Criar anúncio</h2>
    <div className="two"><input name="brand" placeholder="Marca" required/><select name="model" required><option value="">Modelo</option>{Object.keys(marketTable).map(m => <option key={m}>{m}</option>)}</select></div>
    <div className="two"><input name="year" type="number" placeholder="Ano" required/><input name="km" type="number" placeholder="Quilometragem" required/></div>
    <div className="two"><input name="price" type="number" placeholder="Preço desejado" required/><input name="city" placeholder="Cidade/UF" required/></div>
    <input name="image" placeholder="URL da foto do carro" required />
    <textarea name="description" placeholder="Descrição completa do carro" required />
    <label className="check"><input name="acceptsTrade" type="checkbox" /> Aceito proposta de troca</label>
    <button className="primary full"><PlusCircle size={18}/> Publicar anúncio</button>
  </form></main>;
}

function Details({ car, user, proposals, setProposals, messages, setMessages }) {
  if (!car) return null;
  function proposal(e) {
    e.preventDefault(); if (!user) return alert('Faça login para fazer proposta.');
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const item = { id: Date.now(), carId: car.id, carModel: car.model, fromId: user.id, fromName: user.name, toId: car.ownerId, type: d.type, value: d.value, text: d.text, status: 'Pendente' };
    const updated = [...proposals, item]; setProposals(updated); db.saveProposals(updated); e.currentTarget.reset(); alert('Proposta enviada!');
  }
  function message(e) {
    e.preventDefault(); if (!user) return alert('Faça login para mandar mensagem.');
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const item = { id: Date.now(), carId: car.id, fromId: user.id, fromName: user.name, toId: car.ownerId, text: d.text };
    const updated = [...messages, item]; setMessages(updated); db.saveMessages(updated); e.currentTarget.reset();
  }
  return <main className="details"><img src={car.image} alt={car.model}/><section className="panel detailInfo">
    <span className="badge">{car.acceptsTrade ? 'Venda ou troca' : 'Venda'}</span><h1>{car.model}</h1>
    <p className="muted"><MapPin size={16}/> {car.city}</p><strong className="bigPrice">{currency(car.price)}</strong>
    <div className="stats"><span>{car.year}<small>Ano</small></span><span>{Number(car.km).toLocaleString('pt-BR')}<small>KM</small></span><span>{currency(car.marketPrice)}<small>Mercado</small></span></div>
    <p>{car.description}</p><p className="muted">Vendedor: {car.ownerName}</p>
    <form onSubmit={proposal} className="miniForm"><h3><Handshake/> Fazer proposta</h3><select name="type"><option>Compra</option><option>Troca</option></select><input name="value" placeholder="Valor ou carro oferecido" required/><textarea name="text" placeholder="Mensagem para o vendedor" required/><button className="primary full">Enviar proposta</button></form>
    <form onSubmit={message} className="miniForm"><h3><MessageCircle/> Mensagem</h3><input name="text" placeholder="Escreva sua mensagem" required/><button className="full">Enviar mensagem</button></form>
  </section></main>;
}

function Dashboard({ user, cars, proposals, messages }) {
  const myCars = cars.filter(c => c.ownerId === user.id);
  const received = proposals.filter(p => p.toId === user.id);
  const sent = proposals.filter(p => p.fromId === user.id);
  const myMessages = messages.filter(m => m.toId === user.id || m.fromId === user.id);
  return <main><h1>Painel do usuário</h1><div className="dashGrid"><div className="panel"><User/><h3>{user.name}</h3><p>{user.email}</p></div><div className="panel"><Car/><h3>{myCars.length}</h3><p>Anúncios ativos</p></div><div className="panel"><Wallet/><h3>{received.length}</h3><p>Propostas recebidas</p></div></div>
    <h2>Meus anúncios</h2><section className="grid">{myCars.map(c => <CarCard key={c.id} car={c} onClick={() => {}} />)}</section>
    <h2>Propostas recebidas</h2>{received.map(p => <div className="proposal" key={p.id}><b>{p.fromName}</b> quer negociar <b>{p.carModel}</b><p>{p.type}: {p.value}</p><span>{p.text}</span></div>)}
    <h2>Propostas enviadas</h2>{sent.map(p => <div className="proposal" key={p.id}>Você enviou proposta para <b>{p.carModel}</b><p>{p.type}: {p.value}</p><span>{p.text}</span></div>)}
    <h2>Mensagens</h2>{myMessages.map(m => <div className="proposal" key={m.id}><b>{m.fromName}:</b> {m.text}</div>)}
  </main>;
}

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => { db.init(); setUsers(db.getUsers()); setCars(db.getCars()); setProposals(db.getProposals()); setMessages(db.getMessages()); setUser(db.getLoggedUser()); }, []);
  const logout = () => { db.logout(); setUser(null); setPage('home'); };

  return <>
    <Header page={page} setPage={setPage} user={user} logout={logout}/>
    {page === 'home' && <Home cars={cars} setPage={setPage} setSelectedCar={setSelectedCar}/>} 
    {page === 'auth' && <Auth users={users} setUsers={setUsers} setUser={setUser} setPage={setPage}/>} 
    {page === 'create' && <CreateAd user={user} cars={cars} setCars={setCars} setPage={setPage}/>} 
    {page === 'details' && <Details car={selectedCar} user={user} proposals={proposals} setProposals={setProposals} messages={messages} setMessages={setMessages}/>} 
    {page === 'dashboard' && user && <Dashboard user={user} cars={cars} proposals={proposals} messages={messages}/>} 
    <footer>AutoTroca © 2026 — pronto para conectar banco de dados, domínio e hospedagem.</footer>
  </>;
}
