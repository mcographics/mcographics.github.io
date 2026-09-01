"use client";

import { useEffect, useRef, useState } from "react";

type FieroLinkSafetyNoticeProps = {
  requestHref: string;
};

export default function FieroLinkSafetyNotice({ requestHref }: FieroLinkSafetyNoticeProps) {
  const [open, setOpen] = useState(false);
  const readFirstButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => readFirstButton.current?.focus(), 0);
  };

  return <>
    <section className="fierolink-safety-notice" aria-labelledby="fierolink-safety-heading">
      <div>
        <p className="section-kicker">Read first · hardware notice</p>
        <h2 id="fierolink-safety-heading">Experimental vehicle access.</h2>
        <p>FieroLink GT has a receive-only ALDL transport and simulator, but real ECU decoding and vehicle validation are not complete. Read the current boundary before requesting access.</p>
      </div>
      <button ref={readFirstButton} className="button primary" type="button" onClick={() => setOpen(true)}>READ FIRST <span>↗</span></button>
    </section>
    <p className="fierolink-inquiry">Interested in the project, have a question, or able to help with careful Fiero hardware testing? <a href="/contact">Send an inquiry through Contact Us <span>↗</span></a></p>

    <div className="fierolink-modal-backdrop" role="presentation" hidden={!open} aria-hidden={!open}>
      <button className="fierolink-modal-dismiss" type="button" onClick={close} aria-label="Close FieroLink GT hardware notice" />
      <section className="fierolink-modal" role="dialog" aria-modal="true" aria-labelledby="fierolink-modal-title" aria-describedby="fierolink-modal-description">
        <button ref={closeButton} className="fierolink-modal-close" type="button" onClick={close} aria-label="Close FieroLink GT hardware notice">×</button>
        <p className="section-kicker">FieroLink GT · read first</p>
        <h2 id="fierolink-modal-title">What is ready today?</h2>
        <div id="fierolink-modal-description" className="fierolink-modal-copy">
          <p>FieroLink GT is an in-development Windows application. Its current physical hardware path can discover Windows COM ports, open a selected serial port at a provisional 160-baud ALDL setting, and capture timestamped inbound bytes.</p>
          <ul>
            <li>It does not identify the connected ECU, perform an ECU handshake, or decode live Fiero values.</li>
            <li>The dashboard remains simulated. Raw bytes stay behind an explicit decoder gate until packet framing, offsets, checksums, equations, units, and failure behavior are verified.</li>
            <li>The current application has no ECU write, calibration, flash, live-tuning, or trouble-code-clear commands.</li>
            <li>No real Fiero vehicle test has been completed. Adapter electrical levels, wiring, isolation, pin selection, and vehicle compatibility must be independently confirmed.</li>
            <li>Do not treat a Windows COM-port or USB chipset detection as proof that an adapter is safe for a Fiero, and do not assume modern OBD-II compatibility.</li>
          </ul>
          <p className="fierolink-modal-warning"><strong>Request access only if you understand that this is experimental hardware capture, not verified diagnostic advice.</strong> Use the factory service manual, suitable test equipment, and professional judgment for any vehicle work.</p>
        </div>
        <div className="fierolink-modal-actions">
          <a className="button primary" href={requestHref} onClick={close}>Continue with Request <span>↗</span></a>
          <button className="button ghost" type="button" onClick={close}>Close</button>
        </div>
      </section>
    </div>
  </>;
}
