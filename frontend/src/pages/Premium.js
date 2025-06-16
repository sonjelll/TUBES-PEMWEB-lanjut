import React from 'react';

export default function Premium() {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ fontSize: 40, color: '#d4af37', fontWeight: 'bold' }}>P</div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>Masak harian jadi mudah dengan Premium</h2>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px 0', borderBottom: '1px solid #ddd' }}></th>
            <th style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>Gratis</th>
            <th style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #ddd', backgroundColor: '#f9f4e6' }}>Premium</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: 'Bebas iklan', free: true, premium: true },
            { label: 'Resep teratas di peringkat pertama', free: false, premium: true },
            { label: 'Jajaran Resep Unggulan', free: false, premium: true },
            { label: 'Filter resep Premium', free: false, premium: true },
            { label: 'Resep Andalan milikmu sendiri', free: 'Max. 3', premium: 'Tanpa batas', note: '*khusus aplikasi' },
            { label: 'Folder resep khusus', free: false, premium: true },
            { label: 'Menu Mingguan Premium', free: false, premium: true },
          ].map((row, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px 0' }}>
                {row.label}
                {row.note && <div style={{ fontSize: 12, color: '#888' }}>{row.note}</div>}
              </td>
              <td style={{ textAlign: 'center' }}>
                {row.free === true ? '✓' : row.free || ''}
              </td>
              <td style={{ textAlign: 'center', backgroundColor: '#f9f4e6' }}>
                {row.premium === true ? '✓' : row.premium || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ backgroundColor: '#f9f4e6', padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: 10 }}>📜 Langganan Premium</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
          <div>Biaya</div>
          <div>Rp22.000/Bulan</div>
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>
          Langganan bulanan diperpanjang otomatis. Batalkan langganan kapan saja pada bagian Pengaturan.
        </div>
      </div>

      <div style={{ marginBottom: 10, fontWeight: 'bold' }}>Pilih metode pembayaran</div>

      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 15, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ marginRight: 10 }}>💳</div>
          <div>Kartu Kredit</div>
        </div>
        <input
          type="text"
          placeholder="Nomor kartu"
          style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <input
            type="text"
            placeholder="BB / TT"
            style={{ width: '48%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Nomor CVC"
            style={{ width: '48%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <button
          style={{
            width: '100%',
            backgroundColor: '#444',
            color: '#fff',
            padding: 10,
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Bayar dengan Kartu Kredit
        </button>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>atau</div>

      <button
        style={{
          width: '100%',
          backgroundColor: '#00b140',
          color: '#fff',
          padding: 10,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Bayar dengan link
      </button>
    </div>
  );
}
