"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { FileText, Download, Calendar, TrendingUp } from "lucide-react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Type declaration for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number
    }
  }
}

type ReportData = {
  month: string
  totalOrders: number
  totalCost: number
  byVendor: { name: string; orders: number; cost: number }[]
  byDivision: { name: string; orders: number; cost: number }[]
}

export default function AdminReportsPage() {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [reportType, setReportType] = useState<"monthly" | "vendor" | "division">("monthly")
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [selectedMonth])

  const fetchReportData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reports?month=${selectedMonth}&type=${reportType}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data.report)
      }
    } catch (err) {
      console.error('Error fetching report:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getMonthYearText = () => {
    const date = new Date(selectedMonth + '-01')
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }

  const getReportTypeText = () => {
    const types = {
      monthly: 'Ringkasan Bulanan',
      vendor: 'Per Vendor',
      division: 'Per Divisi'
    }
    return types[reportType]
  }

  const handleExportPDF = () => {
    if (!reportData) {
      alert('Tidak ada data untuk di-export')
      return
    }

    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text('Laporan Rekapitulasi Konsumsi', 14, 15)
    
    // Add metadata
    doc.setFontSize(11)
    doc.text(`Periode: ${getMonthYearText()}`, 14, 25)
    doc.text(`Jenis Laporan: ${getReportTypeText()}`, 14, 31)
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 37)
    
    let currentY = 45

    // Summary section
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Ringkasan', 14, currentY)
    currentY += 8
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Total Pesanan: ${reportData.totalOrders}`, 14, currentY)
    currentY += 6
    doc.text(`Total Biaya: ${formatCurrency(reportData.totalCost)}`, 14, currentY)
    currentY += 6
    doc.text(`Rata-rata per Order: ${formatCurrency(reportData.totalCost / reportData.totalOrders)}`, 14, currentY)
    currentY += 12

    // Vendor table
    if (reportType === 'monthly' || reportType === 'vendor') {
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Rekapitulasi per Vendor', 14, currentY)
      currentY += 6
      
      const vendorData = reportData.byVendor.map(vendor => [
        vendor.name,
        vendor.orders.toString(),
        formatCurrency(vendor.cost),
        `${((vendor.cost / reportData.totalCost) * 100).toFixed(1)}%`
      ])
      
      // Add total row
      vendorData.push([
        'Total',
        reportData.totalOrders.toString(),
        formatCurrency(reportData.totalCost),
        '100%'
      ])
      
      autoTable(doc, {
        head: [['Nama Vendor', 'Jumlah Order', 'Total Biaya', 'Persentase']],
        body: vendorData,
        startY: currentY,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [220, 38, 38] }, // Red color
        foot: [],
        showFoot: false
      })
      
      currentY = doc.lastAutoTable?.finalY + 10 || currentY + 10
    }

    // Division table
    if (reportType === 'monthly' || reportType === 'division') {
      // Add new page if needed
      if (currentY > 240) {
        doc.addPage()
        currentY = 20
      }
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Rekapitulasi per Divisi', 14, currentY)
      currentY += 6
      
      const divisionData = reportData.byDivision.map(division => [
        division.name,
        division.orders.toString(),
        formatCurrency(division.cost),
        `${((division.cost / reportData.totalCost) * 100).toFixed(1)}%`
      ])
      
      // Add total row
      divisionData.push([
        'Total',
        reportData.totalOrders.toString(),
        formatCurrency(reportData.totalCost),
        '100%'
      ])
      
      autoTable(doc, {
        head: [['Divisi', 'Jumlah Order', 'Total Biaya', 'Persentase']],
        body: divisionData,
        startY: currentY,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 163, 74] }, // Green color
        foot: [],
        showFoot: false
      })
    }
    
    // Save the PDF
    const fileName = `laporan-konsumsi-${selectedMonth}-${reportType}.pdf`
    doc.save(fileName)
  }

  const handleExportExcel = () => {
    if (!reportData) {
      alert('Tidak ada data untuk di-export')
      return
    }

    const workbook = XLSX.utils.book_new()
    
    // Summary sheet
    const summaryData = [
      ['Laporan Rekapitulasi Konsumsi'],
      [],
      ['Periode', getMonthYearText()],
      ['Jenis Laporan', getReportTypeText()],
      ['Tanggal Export', new Date().toLocaleDateString('id-ID')],
      [],
      ['RINGKASAN'],
      ['Total Pesanan', reportData.totalOrders],
      ['Total Biaya', reportData.totalCost],
      ['Rata-rata per Order', reportData.totalCost / reportData.totalOrders]
    ]
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summaryWs, 'Ringkasan')
    
    // Vendor sheet
    if (reportType === 'monthly' || reportType === 'vendor') {
      const vendorData = [
        ['Nama Vendor', 'Jumlah Order', 'Total Biaya', 'Persentase'],
        ...reportData.byVendor.map(vendor => [
          vendor.name,
          vendor.orders,
          vendor.cost,
          `${((vendor.cost / reportData.totalCost) * 100).toFixed(1)}%`
        ]),
        ['Total', reportData.totalOrders, reportData.totalCost, '100%']
      ]
      
      const vendorWs = XLSX.utils.aoa_to_sheet(vendorData)
      vendorWs['!cols'] = [
        { wch: 30 }, // Nama Vendor
        { wch: 15 }, // Jumlah Order
        { wch: 20 }, // Total Biaya
        { wch: 12 }  // Persentase
      ]
      XLSX.utils.book_append_sheet(workbook, vendorWs, 'Per Vendor')
    }
    
    // Division sheet
    if (reportType === 'monthly' || reportType === 'division') {
      const divisionData = [
        ['Divisi', 'Jumlah Order', 'Total Biaya', 'Persentase'],
        ...reportData.byDivision.map(division => [
          division.name,
          division.orders,
          division.cost,
          `${((division.cost / reportData.totalCost) * 100).toFixed(1)}%`
        ]),
        ['Total', reportData.totalOrders, reportData.totalCost, '100%']
      ]
      
      const divisionWs = XLSX.utils.aoa_to_sheet(divisionData)
      divisionWs['!cols'] = [
        { wch: 30 }, // Divisi
        { wch: 15 }, // Jumlah Order
        { wch: 20 }, // Total Biaya
        { wch: 12 }  // Persentase
      ]
      XLSX.utils.book_append_sheet(workbook, divisionWs, 'Per Divisi')
    }
    
    // Save the Excel file
    const fileName = `laporan-konsumsi-${selectedMonth}-${reportType}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laporan Rekapitulasi</h1>
              <p className="text-gray-600 dark:text-gray-400">Rekap biaya konsumsi dan statistik</p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Periode
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Laporan
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as typeof reportType)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="monthly">Ringkasan Bulanan</option>
                <option value="vendor">Per Vendor</option>
                <option value="division">Per Divisi</option>
              </select>
            </div>
            <button
              onClick={fetchReportData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Refresh
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Memuat data laporan...
          </div>
        ) : !reportData ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Tidak ada data
          </div>
        ) : (
          <>
            {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Pesanan</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{reportData.totalOrders}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% dari bulan lalu</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Biaya</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(reportData.totalCost)}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8% dari bulan lalu</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata per Order</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(reportData.totalCost / reportData.totalOrders)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Estimasi</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Report Table - By Vendor */}
        {(reportType === "monthly" || reportType === "vendor") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rekapitulasi per Vendor</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nama Vendor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Jumlah Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Biaya
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.byVendor.map((vendor, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                      {vendor.orders}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(vendor.cost)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                      {((vendor.cost / reportData.totalCost) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-700 font-bold">
                  <td className="px-6 py-4 text-gray-900 dark:text-white">Total</td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{reportData.totalOrders}</td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{formatCurrency(reportData.totalCost)}</td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-white">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Report Table - By Division */}
        {(reportType === "monthly" || reportType === "division") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rekapitulasi per Divisi</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Divisi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Jumlah Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Biaya
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.byDivision.map((division, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {division.name}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                      {division.orders}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(division.cost)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                      {((division.cost / reportData.totalCost) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-700 font-bold">
                  <td className="px-6 py-4 text-gray-900 dark:text-white">Total</td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{reportData.totalOrders}</td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{formatCurrency(reportData.totalCost)}</td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-white">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
