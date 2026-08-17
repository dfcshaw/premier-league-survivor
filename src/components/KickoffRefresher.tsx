{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 "use client";\
import \{ useEffect \} from "react";\
import \{ useRouter \} from "next/navigation";\
\
export default function KickoffRefresher(\{ kickoffs \}: \{ kickoffs: string[] \}) \{\
  const router = useRouter();\
  useEffect(() => \{\
    const nextKickoff = kickoffs\
      .map((k) => new Date(k).getTime())\
      .filter((t) => t > Date.now())\
      .sort((a, b) => a - b)[0];\
    if (!nextKickoff) return;\
    const timer = setTimeout(() => router.refresh(), nextKickoff - Date.now() + 1000);\
    return () => clearTimeout(timer);\
  \}, [kickoffs, router]);\
  return null;\
\}}