"use client"
import { useUserApi } from '@/api/user/userUserApi'
import { TableDemo } from '@/components/Table/TableDemo'
import React, { useEffect, useState } from 'react'

function ModLayout() {

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  const { findAll } = useUserApi()
  useEffect(() => {
    findAll()
      // .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div className="flex flex-col font-bold h-full justify-center items-center pb-20">
      <div className="text-7xl text-white mb-10">Admin Dashboard</div>
      <TableDemo data={data} />
    </div>

  )
}

export default ModLayout