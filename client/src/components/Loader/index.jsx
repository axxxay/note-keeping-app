import React from 'react'
import { Grid } from 'react-loader-spinner'
import './style.css'

function Loader() {
  return (
    <div className='loader-container'>
        <Grid
            visible={true}
            height="40"
            width="40"
            color="#C8ACD6"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass="grid-wrapper"
        />
    </div>
  )
}

export default Loader