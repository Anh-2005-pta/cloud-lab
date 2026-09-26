import { useEffect, useState } from 'react'
import './App.css'

const emptyForm = { studentId: '', name: '', email: '' }
async function api(path, options = {}) {
  const response = await fetch(path, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Không thể kết nối máy chủ.')
  return data
}
export default function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    api('/api/students', { signal: controller.signal })
      .then(setStudents)
      .catch(e => { if (e.name !== 'AbortError') setError(e.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])
  async function refresh() {
    setLoading(true)
    setError('')
    try { setStudents(await api('/api/students')) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const student = await api(editingId ? `/api/students/${editingId}` : '/api/students', {
        method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStudents(current => editingId ? current.map(item => item._id === editingId ? student : item) : [student, ...current])
      setForm(emptyForm)
      setEditingId(null)
      setNotice('Đã lưu sinh viên ' + student.studentId + ' vào MongoDB.')
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }
  function edit(student) {
    setEditingId(student._id)
    setForm({ studentId: student.studentId, name: student.name, email: student.email })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  async function remove(student) {
    if (!window.confirm(`Xóa sinh viên ${student.studentId}?`)) return
    setError('')
    try {
      await api(`/api/students/${student._id}`, { method: 'DELETE' })
      setStudents(current => current.filter(item => item._id !== student._id))
      setNotice(`Đã xóa sinh viên ${student.studentId}.`)
    } catch (e) { setError(e.message) }
  }
  const filtered = students.filter(student =>
    [student.studentId, student.name, student.email].join(' ').toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))
  return <main>
    <header className="masthead"><a href="/" className="brand"><span className="brand-mark">S.</span> SỔ SINH VIÊN</a><span className="lab-label">CLOUD LAB / 04 · V2</span></header>
    <section className="intro"><div><p className="eyebrow">MERN · QUẢN LÝ DỮ LIỆU</p><h1>Mỗi sinh viên,<br /><em>một hành trình.</em></h1><p className="description">Danh sách tập trung. Thông tin rõ ràng.<br />Thêm sinh viên và lưu trực tiếp vào MongoDB Atlas.</p></div><div className="counter"><strong>{loading ? '—' : String(students.length).padStart(2, '0')}</strong><span>SINH VIÊN ĐÃ LƯU</span></div></section>
    {error && <div className="message error" role="alert">{error} <button onClick={refresh} disabled={loading}>Thử tải lại</button></div>}
    {notice && <div className="message success" role="status">{notice}</div>}
    <div className="workspace"><section className="form-panel" aria-labelledby="add-heading"><p className="section-number">01 / {editingId ? 'CẬP NHẬT' : 'THÊM MỚI'}</p><h2 id="add-heading">Thông tin sinh viên</h2><p className="muted">Điền đủ ba trường bên dưới.</p><form onSubmit={submit}><label htmlFor="studentId">Mã số sinh viên</label><input id="studentId" required maxLength={40} value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} placeholder="Ví dụ: SV2026001" /><label htmlFor="name">Họ và tên</label><input id="name" required maxLength={120} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Minh An" /><label htmlFor="email">Email</label><input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="sinhvien@example.com" /><button className="primary" disabled={saving || loading}>{saving ? 'Đang lưu…' : editingId ? 'Lưu thay đổi' : 'Thêm sinh viên'} <span aria-hidden="true">↗</span></button>{editingId && <button type="button" className="refresh" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Hủy sửa</button>}</form><p className="form-note">MSSV là duy nhất cho mỗi sinh viên.</p></section>
    <section className="list-panel" aria-labelledby="list-heading"><div className="list-heading"><div><p className="section-number">02 / DANH SÁCH</p><h2 id="list-heading">Sinh viên đã đăng ký</h2></div><button className="refresh" onClick={refresh} disabled={loading || saving}>Làm mới ↻</button></div><label className="search-label" htmlFor="search">Tìm theo MSSV, họ tên hoặc email</label><input id="search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm sinh viên…" />{loading ? <p className="empty" role="status">Đang tải danh sách…</p> : filtered.length ? <div className="table-wrap"><table><thead><tr><th>MSSV</th><th>HỌ VÀ TÊN</th><th>EMAIL</th><th>THAO TÁC</th></tr></thead><tbody>{filtered.map(student => <tr key={student._id}><td className="student-id">{student.studentId}</td><td>{student.name}</td><td>{student.email}</td><td><button className="refresh" onClick={() => edit(student)}>Sửa</button> <button className="refresh" onClick={() => remove(student)}>Xóa</button></td></tr>)}</tbody></table></div> : <p className="empty">{query ? 'Không tìm thấy sinh viên phù hợp.' : 'Chưa có sinh viên. Hãy thêm người đầu tiên.'}</p>}<p className="list-footer">{filtered.length} kết quả <span>React → Express → MongoDB</span></p></section></div>
    <footer>THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY <span>Student Directory · 2026</span></footer>
  </main>
}
