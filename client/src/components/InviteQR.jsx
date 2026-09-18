import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const InviteQR = () => {
  const [open, setOpen] = useState(false);
  const url = window.location.origin;

  return (
    <>
      <button type="button" className="invite-button" onClick={() => setOpen(true)}>
        📱 Inviter
      </button>

      {open && (
        <div className="invite-overlay" onClick={() => setOpen(false)}>
          <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Inviter un musicien</h2>
            <p>Faites scanner ce code avec l'appareil photo du téléphone/tablette</p>
            <div className="invite-qr">
              <QRCodeSVG value={url} size={220} />
            </div>
            <p className="invite-url">{url}</p>
            <button type="button" className="invite-close" onClick={() => setOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteQR;
