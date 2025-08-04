
import React, { useState, useEffect, useCallback } from 'react';
import { EthOsLogo } from './components/Icons';
import { SnakeGame } from './components/SnakeGame';
import { useInterval } from './hooks/useInterval';

const InfoModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
    <div className="bg-white/80 p-8 rounded-2xl shadow-2xl max-w-sm text-center border border-white/20">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Eth OS!</h2>
      <p className="text-gray-600 mb-6">This website was created just for fun and for educational purposes. None of the features represent real financial transactions or tokens.</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300"
      >
        I Understand
      </button>
    </div>
  </div>
);

const LandingPage = ({ onAccessGranted }: { onAccessGranted: () => void }) => {
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = useCallback(() => {
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCode(newCode);
    setInputCode('');
    setError('');
    setCopied(false);
  }, []);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccess = () => {
    if (inputCode === code) {
      onAccessGranted();
    } else {
      setError('Invalid code. Please copy the generated code.');
    }
  };
  
  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Eth OS</h1>
        <p className="text-center text-gray-600 mb-8">Your portal to the fun side of crypto.</p>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Your Access Code:</label>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <span className="font-mono text-lg text-gray-800 tracking-widest flex-grow">{code}</span>
            <button onClick={handleCopy} className="ml-4 px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Paste Code to Enter Farm:</label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full px-4 py-3 font-mono bg-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Paste code here"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <button
          onClick={handleAccess}
          className="w-full py-3 bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
        >
          Access Farm
        </button>
      </div>
    </div>
  );
};

const FarmPage = () => {
  const APR = 0.25; // 25% APR
  const [satoshiBalance, setSatoshiBalance] = useState(1000);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [mintAmount, setMintAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');

  useInterval(() => {
    if (stakedBalance > 0) {
      const rewardPerSecond = (stakedBalance * APR) / (365 * 24 * 60 * 60);
      setRewards(prev => prev + rewardPerSecond);
    }
  }, 1000);

  const handleMint = () => {
    const amount = parseInt(mintAmount);
    if (!isNaN(amount) && amount > 0) {
      setSatoshiBalance(prev => prev + amount);
      setMintAmount('');
    }
  };

  const handleStake = () => {
    const amount = parseInt(stakeAmount);
    if (!isNaN(amount) && amount > 0 && amount <= satoshiBalance) {
      setSatoshiBalance(prev => prev - amount);
      setStakedBalance(prev => prev + amount);
      setStakeAmount('');
    }
  };

  const handleUnstake = () => {
    const amount = parseInt(stakeAmount);
    if (!isNaN(amount) && amount > 0 && amount <= stakedBalance) {
      setStakedBalance(prev => prev - amount);
      setSatoshiBalance(prev => prev + amount);
      setStakeAmount('');
    }
  };
  
  const handleClaimRewards = () => {
    setSatoshiBalance(prev => prev + rewards);
    setRewards(0);
  };

  return (
    <div className="flex-grow p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Balances */}
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Treasury</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/50 rounded-lg">
              <p className="text-sm text-gray-600">Satoshi Balance</p>
              <p className="text-2xl font-semibold text-indigo-700">{satoshiBalance.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <p className="text-sm text-gray-600">Staked Satoshi</p>
              <p className="text-2xl font-semibold text-green-700">{stakedBalance.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <p className="text-sm text-gray-600">Earned Rewards</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-semibold text-yellow-600">{rewards.toFixed(6)}</p>
                <button onClick={handleClaimRewards} disabled={rewards === 0} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400 transition-colors">Claim</button>
              </div>
            </div>
            <div className="text-center pt-2">
              <p className="text-lg font-semibold text-gray-700">Staking APR: <span className="text-green-600 font-bold">{APR * 100}%</span></p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-8">
          <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Mint Satoshi</h3>
            <div className="flex space-x-2">
              <input type="number" placeholder="Amount" value={mintAmount} onChange={e => setMintAmount(e.target.value)} className="w-full px-4 py-2 bg-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <button onClick={handleMint} className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-all">Mint</button>
            </div>
          </div>
          <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Stake / Unstake</h3>
            <div className="flex space-x-2">
              <input type="number" placeholder="Amount" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} className="w-full px-4 py-2 bg-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400" />
              <button onClick={handleStake} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all">Stake</button>
              <button onClick={handleUnstake} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all">Unstake</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ activeTab, setActiveTab, onGmClick, isGmDisabled, gmMessage }: { activeTab: string; setActiveTab: (tab: 'farm' | 'game') => void; onGmClick: () => void; isGmDisabled: boolean; gmMessage: string; }) => (
  <header className="w-full p-4 bg-white/20 backdrop-blur-lg border-b border-white/30 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <h2 className="text-2xl font-bold text-gray-800">Eth OS</h2>
      <nav className="flex space-x-2 bg-white/50 p-1 rounded-lg">
        <button onClick={() => setActiveTab('farm')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'farm' ? 'bg-indigo-500 text-white shadow' : 'text-gray-600 hover:bg-white/70'}`}>Farm</button>
        <button onClick={() => setActiveTab('game')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'game' ? 'bg-indigo-500 text-white shadow' : 'text-gray-600 hover:bg-white/70'}`}>Game</button>
      </nav>
    </div>
    <div className="relative">
      <button onClick={onGmClick} disabled={isGmDisabled} className="px-6 py-2 bg-yellow-400 text-gray-800 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:text-gray-600 disabled:scale-100">
        GM
      </button>
      {gmMessage && <p className="absolute top-full right-0 mt-2 p-3 bg-white rounded-lg shadow-lg text-sm text-gray-700 w-64">{gmMessage}</p>}
    </div>
  </header>
);

export default function App() {
  const [showNotice, setShowNotice] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<'farm' | 'game'>('farm');
  const [gmMessage, setGmMessage] = useState('');
  const [isGmDisabled, setIsGmDisabled] = useState(false);

  const gmMessages = [
    "Good Morning! Let's make today amazing!",
    "GM! Rise and shine, time to build!",
    "A beautiful morning to you! What will you create today?",
    "GM! Seize the day and the opportunities it holds.",
    "Good Morning! Wishing you a day full of positive vibes and success."
  ];

  useEffect(() => {
    const noticeShown = sessionStorage.getItem('ethos-notice-shown');
    if (!noticeShown) {
      setShowNotice(true);
    }
  }, []);
  
  useEffect(() => {
    const lastClick = localStorage.getItem('gm-last-click');
    if (lastClick) {
      const lastClickDate = new Date(lastClick).toDateString();
      const todayDate = new Date().toDateString();
      if (lastClickDate === todayDate) {
        setIsGmDisabled(true);
      }
    }
  }, []);

  const handleCloseNotice = () => {
    sessionStorage.setItem('ethos-notice-shown', 'true');
    setShowNotice(false);
  };

  const handleGmClick = () => {
    const randomMessage = gmMessages[Math.floor(Math.random() * gmMessages.length)];
    setGmMessage(randomMessage);
    setIsGmDisabled(true);
    localStorage.setItem('gm-last-click', new Date().toISOString());
    setTimeout(() => setGmMessage(''), 5000);
  };

  return (
    <div className="relative min-h-screen w-full text-gray-800 overflow-hidden flex flex-col">
      <EthOsLogo className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg text-white opacity-10 -z-10" />
      {showNotice && <InfoModal onClose={handleCloseNotice} />}
      
      {!accessGranted ? (
        <LandingPage onAccessGranted={() => setAccessGranted(true)} />
      ) : (
        <div className="w-full h-screen flex flex-col z-10">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} onGmClick={handleGmClick} isGmDisabled={isGmDisabled} gmMessage={gmMessage} />
          <div className="flex-grow overflow-y-auto">
            {activeTab === 'farm' && <FarmPage />}
            {activeTab === 'game' && <SnakeGame />}
          </div>
        </div>
      )}

      <footer className="absolute bottom-0 w-full text-center p-4 text-white/70 text-sm z-0">
        Website created by <a href="https://x.com/Mahakal95" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-white transition-colors">https://x.com/Mahakal95</a>
      </footer>
    </div>
  );
}
