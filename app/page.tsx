"use client";

import { useState, useEffect } from "react";

interface Stats {
  totalRows: number;
  estimatedSize: number;
  maxSize: number;
  percentage: number;
  method: string;
}

export default function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  
 
  // Ambil data monitoring
  const [stats, setStats] = useState<Stats | null>(null);
	
  useEffect(() => {
    const fetchStats = async () => {
      try{
		const res = await fetch("/api/stats");
		const data = await res.json();
		if (res.ok) setStats(data);
	  }catch (e){
		console.error(e);
	  }
    };

    fetchStats();
  }, []);
   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
	// Validasi input
    if (!url || url.trim() === "") {
      setError("URL tidak boleh kosong!");
      return;
    }
 
	setError(""); // reset error dulu
    setShortUrl(""); // reset hasil lama

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alias }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan.");
        return;
      }

      setShortUrl(data.shortUrl);
    } catch (err) {
      setError("Server tidak bisa dihubungi.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {stats && (
  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-5 py-3 rounded-lg w-64 border-3 border-[#249365]">
    <p className="text-sm text-gray-600 mb-2">📊 DB Usage</p>
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full ${
          stats.percentage < 70
            ? "bg-green-500"
            : stats.percentage < 90
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
        style={{ width: `${stats.percentage}%` }}
      ></div>
    </div>
    /*<p className="mt-2 text-xs text-gray-700">
      {(stats.estimatedSize / 1024 / 1024).toFixed(2)} MB /{" "}
      {stats.maxSize / 1024 / 1024} MB
    </p>*/
    <p className="text-xs text-gray-500 italic mt-2">
      ({stats.method === "accurate" ? "Akurat via Postgres" : "Estimasi via row count"})
    </p>
  </div>
)}
	  
	  <div className="w-full max-w-lg pb-2 p-8 bg-white rounded-lg border-3 border-[#249365]">
        <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold text-gray-800 mb-6">
  <img src="/nbi.png" alt="Logo" className="w-18 h-18" />URL Shortener</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Input URL Panjang */}
          <input
            type="text"
            placeholder="Masukkan URL panjang..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       placeholder-gray-400 shadow-sm"
          />

          {/* Input Alias Custom */}
          <input
            type="text"
            placeholder="Custom alias (opsional, misal: my-link)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-[#249365] 
                       placeholder-gray-400 shadow-sm"
          />
		  
		  <button type="submit" className="mt-1 relative px-10 py-3 font-medium text-white transition duration-300 bg-[#249365] rounded-md hover:bg-[#2F9C6F] ease"><span class="absolute bottom-0 left-0 h-full"><svg viewBox="0 0 487 487" className="w-auto h-full opacity-100 object-stretch" xmlns="http://www.w3.org/2000/svg"><path d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z" fill="#FFF" fill-rule="nonzero" fill-opacity=".1"></path></svg></span><span className="absolute top-0 right-0 w-12 h-full"><svg viewBox="0 0 487 487" className="object-cover w-full h-full" xmlns="http://www.w3.org/2000/svg"><path d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z" fill="#FFF" fill-rule="nonzero" fill-opacity=".1"></path></svg></span><span className="relative font-semibold">Shorten!</span></button>
          
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center text-sm">
            ❌ {error}
          </div>
        )}

        {/* Short URL Result */}
        {shortUrl && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            {/* <p className="text-gray-700">✨ Short URL:</p> */}
            <a
              href={shortUrl}
              className="block text-lg font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              {shortUrl}
            </a>
          </div>
        )}
		 <div className="mt-4 p-2 text-center">
            <p className="text-gray-700 text-sm font-semibold text-red-200">2025 - IKOIT</p>
          </div>
      </div>
    </main>
  );
}