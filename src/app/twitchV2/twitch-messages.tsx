"use client";
import React from 'react'

export default function TwitchMessages({message}: {message: string}) {
  return (
    <div>
      <p>{message}</p>
    </div>
  )
}
