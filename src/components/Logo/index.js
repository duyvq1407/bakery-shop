import React from 'react'
import './style.css'
import Logoimg from '../../assets/images/logo-.png'

const Logo = (props) => {
  return (
    <div className="logo min-h-[65px] tw-flex tw-items-center logo-brand tw-text-[18px]" >
        <img width={40} src={Logoimg} alt="logo"/> bakery Shop
    </div>
  )
}

export default Logo