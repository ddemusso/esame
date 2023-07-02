import React from "react";
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Button({ icon, description, url }) {
  return <li><Link to={url}><FontAwesomeIcon icon={icon} /> {description}</Link></li>
}