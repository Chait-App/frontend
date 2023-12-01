// pages/index.js
"use client";
import SocketConnection from '../components/socketConnection';
import dynamic from 'next/dynamic';


const Home = () => {
 return (
    <div>
      <SocketConnection />
    </div>
 );
};

export default dynamic(() => Promise.resolve(Home), {ssr: false})
