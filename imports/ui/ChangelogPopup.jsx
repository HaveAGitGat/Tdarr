import LatestDevNotes from "./tab_Dev_latest.jsx";
import React from "react";
import { Modal } from "react-bootstrap";

export function ChangelogPopup(props) {
  return (
    <Modal
      size="lg"
      show={props.shouldShow}
      onHide={props.onHideHandler}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Changelog
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LatestDevNotes></LatestDevNotes>
      </Modal.Body>
    </Modal>
    );
}