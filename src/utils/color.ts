type blogStatus = "ACCEPT" | "PENDING"| "REJECT"|"BLOCK"
type statusColor = {
    [key in blogStatus] : string
}
export  const color : statusColor = {
    "ACCEPT": `bg-green-200`,
    "BLOCK": `bg-red-200`,
    "PENDING": 'bg-yellow-200',
    "REJECT": 'bg-orange-200'
}
