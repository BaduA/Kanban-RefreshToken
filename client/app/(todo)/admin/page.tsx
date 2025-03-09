"use client"
import { useUserApi } from "@/api/user/userUserApi"
import { TableDemo } from "@/components/Table/TableDemo";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [fetchCount, setFetchCount] = useState(0)
  const { findAll, changeRole } = useUserApi()
  const onChangeRole = async (id: string, role: string) => {
    await changeRole(id, role)
    setLoading(true)
    setFetchCount(fetchCount + 1)
  }
  useEffect(() => {
    findAll()
      // .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [fetchCount])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div className="flex flex-col font-bold h-full justify-center items-center pb-20">
      <div className="text-7xl text-white mb-10">Admin Dashboard</div>
      <TableDemo data={data} onChangeRole={onChangeRole} />
    </div>

  )
}

export default AdminDashboard