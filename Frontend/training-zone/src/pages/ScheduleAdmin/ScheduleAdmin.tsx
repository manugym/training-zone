import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import NavBar from "../../components/NavBar/NavBar";
import scheduleService from "../../services/schedule.service";
import classService from "../../services/class.service";
import { ScheduleDto } from "../../models/schedule-dto";
import { CreateSchedule } from "../../models/create-schedule";
import { Class } from "../../models/class";
import { ClassType } from "../../models/enums/class-type";
import { TrainerDto } from "../../models/trainer-dto";
import { UpdateSchedule } from "../../models/update-schedule";
import "./ScheduleAdmin.css";

const displayDateTime = (date: Date) => format(date, "yyyy-MM-dd HH:mm");

type FormState = CreateSchedule;

const initialForm: FormState = {
  ClassId: 0,
  UserId: 0,
  MaxCapacity: 0,
  Price: 0,
  StartDateTime: new Date(),
  EndDateTime: new Date(),
};

export default function ScheduleAdmin() {
  const [data, setData] = useState<ScheduleDto[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [trainers, setTrainers] = useState<TrainerDto[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const schedules = await scheduleService.getAllSchedules() || [];
      setData(
        schedules.map((s: any) => ({
          ...s,
          StartDateTime: new Date(s.StartDateTime),
          EndDateTime: new Date(s.EndDateTime),
        }))
      );
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const clases = await classService.getAllClasses();
      setClasses(clases || []);
    } catch {
      setClasses([]);
    }
  };

  const fetchTrainers = async () => {
    try {
      const allTrainers = await scheduleService.getAllTrainers();
      setTrainers(allTrainers || []);
    } catch {
      setTrainers([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
    fetchTrainers();
  }, []);

  const openModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (schedule: ScheduleDto) => {
    setForm({
      ClassId: schedule.ClassId,
      UserId: schedule.Trainer.Id,
      MaxCapacity: schedule.MaxCapacity,
      Price: schedule.Price,
      StartDateTime: schedule.StartDateTime,
      EndDateTime: schedule.EndDateTime,
    });
    setEditingId(schedule.Id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["ClassId", "UserId", "MaxCapacity", "Price"];
    const dateFields = ["StartDateTime", "EndDateTime"];

    setForm((f) => ({
      ...f,
      [name]: numericFields.includes(name)
        ? Number(value)
        : dateFields.includes(name)
          ? new Date(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();

    if (!Number.isInteger(form.ClassId) || form.ClassId <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Clase requerida",
        text: "Selecciona una clase válida.",
      });
    }

    if (!Number.isInteger(form.UserId) || form.UserId <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Entrenador requerido",
        text: "Debes seleccionar un entrenador válido.",
      });
    }

    if (form.MaxCapacity <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Capacidad inválida",
        text: "La capacidad debe ser mayor que cero.",
      });
    }

    if (form.Price < 0) {
      return Swal.fire({
        icon: "warning",
        title: "Precio inválido",
        text: "El precio no puede ser negativo.",
      });
    }

    if (!form.StartDateTime || !form.EndDateTime) {
      return Swal.fire({
        icon: "warning",
        title: "Fechas incompletas",
        text: "Debes seleccionar una hora de inicio y una de fin.",
      });
    }

    if (form.StartDateTime < now) {
      return Swal.fire({
        icon: "warning",
        title: "Inicio en el pasado",
        text: "La hora de inicio no puede estar en el pasado.",
      });
    }

    if (form.EndDateTime <= form.StartDateTime) {
      return Swal.fire({
        icon: "warning",
        title: "Hora de fin inválida",
        text: "La hora de fin debe ser posterior a la de inicio.",
      });
    }

    try {
      if (editingId === null) {
        await scheduleService.createSchedule(form);
        Swal.fire({
          icon: "success",
          title: "Horario creado",
          text: "El horario se ha creado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        const updateData: UpdateSchedule = {
          ClassId: form.ClassId,
          UserId: form.UserId,
          MaxCapacity: form.MaxCapacity,
          Price: form.Price,
          StartDateTime: form.StartDateTime,
          EndDateTime: form.EndDateTime,
        };
        await scheduleService.updateSchedule(editingId, updateData);
        Swal.fire({
          icon: "success",
          title: "Horario actualizado",
          text: "El horario se ha actualizado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      await fetchSchedules();
      closeModal();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Error guardando el horario",
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar horario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await scheduleService.deleteSchedule(id);
      await fetchSchedules();
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El horario se eliminó correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error eliminando el horario',
      });
    }
  };

  const inputDateValue = (date: Date) =>
    date ? format(date, "yyyy-MM-dd'T'HH:mm") : "";

  return (
    <>
      <NavBar />
      <div className="view-container">
        <h1>Gestión de Horarios</h1>
        <button className="select" onClick={openModal}>
          Crear horario
        </button>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Clase</th>
                <th>Entrenador</th>
                <th>Capacidad</th>
                <th>Precio</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Acción</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>Cargando...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No hay horarios
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.Id}>
                    <td>{item.Id}</td>
                    <td>
                      {(() => {
                        const cls = classes.find((c) => c.Id === item.ClassId);
                        return cls
                          ? `${ClassType[cls.Type]}`
                          : item.ClassId;
                      })()}
                    </td>
                    <td>
                      {(() => {
                        const foundTrainer = trainers.find(t => t.Id === item.Trainer.Id);
                        return foundTrainer ? foundTrainer.Name : item.Trainer.Name ?? item.Trainer.Id;
                      })()}
                    </td>
                    <td>{item.MaxCapacity}</td>
                    <td>{item.Price} €</td>
                    <td>{displayDateTime(item.StartDateTime)}</td>
                    <td>{displayDateTime(item.EndDateTime)}</td>
                    <td>
                      <button className="select" onClick={() => openEdit(item)}>
                        Editar
                      </button>
                      &nbsp;
                      <button className="select" onClick={() => handleDelete(item.Id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <form onSubmit={handleSubmit} className="modal-form">
                <h2>{editingId === null ? "Crear Horario" : "Editar Horario"}</h2>
                <div className="form-row">
                  <label htmlFor="ClassId">Clase:</label>
                  <select
                    className="select"
                    name="ClassId"
                    value={form.ClassId}
                    onChange={handleChange}
                    required
                  >
                    <option value={0}>Selecciona una clase</option>
                    {classes.map(cls => (
                      <option key={cls.Id} value={cls.Id}>
                        {ClassType[cls.Type]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label htmlFor="UserId">Entrenador:</label>
                  <select
                    className="select"
                    name="UserId"
                    value={form.UserId}
                    onChange={handleChange}
                    required
                  >
                    <option value={0}>Selecciona un entrenador</option>
                    {trainers.map(tr => (
                      <option key={tr.Id} value={tr.Id}>
                        {tr.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label htmlFor="MaxCapacity">Capacidad:</label>
                  <input
                    className="select"
                    type="number"
                    name="MaxCapacity"
                    placeholder="Capacidad"
                    value={form.MaxCapacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="Price">Precio:</label>
                  <input
                    className="select"
                    type="number"
                    name="Price"
                    placeholder="Precio"
                    value={form.Price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="StartDateTime">Inicio:</label>
                  <input
                    className="select"
                    type="datetime-local"
                    name="StartDateTime"
                    value={inputDateValue(form.StartDateTime)}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="EndDateTime">Fin:</label>
                  <input
                    className="select"
                    type="datetime-local"
                    name="EndDateTime"
                    value={inputDateValue(form.EndDateTime)}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-buttons">
                  <button className="select" type="submit">
                    {editingId === null ? "Crear" : "Guardar"}
                  </button>
                  <button className="select" type="button" onClick={closeModal}>
                    Cancelar
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
