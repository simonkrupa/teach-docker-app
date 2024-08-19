import './NetworkNode.css';

export default function NetworkNode() {
  return (
    <div className="network-container">
      <div className="grid-container">
        <div className="grid-item">
          Name: <b>bridge</b>
        </div>
        <div className="grid-item">
          Subnet: <b>172.17.0.0/16</b>
        </div>
        <div className="grid-item">
          Driver: <b>bridge</b>
        </div>
        <div className="grid-item">
          Gateway: <b>172.17.0.1</b>
        </div>
      </div>
    </div>
  );
}
