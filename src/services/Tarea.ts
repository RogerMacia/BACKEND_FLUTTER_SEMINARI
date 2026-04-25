import mongoose from 'mongoose';
import Tarea, { ITareaModel } from '../models/Tarea';
import Organizacion from '../models/Organizacion';

interface ICreateTareaInput {
    titulo: string;
    fechaInicio: Date;
    fechaFin: Date;
    usuarios?: (mongoose.Types.ObjectId | string)[];
}

const createTareaByOrganizacion = async (
    organizacionId: string,
    data: ICreateTareaInput
): Promise<ITareaModel | null> => {
    if (!mongoose.Types.ObjectId.isValid(organizacionId)) {
        return null;
    }

    const organizacion = await Organizacion.findById(organizacionId);
    if (!organizacion) {
        return null;
    }

    const tarea = new Tarea({
        _id: new mongoose.Types.ObjectId(),
        titulo: data.titulo,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        usuarios: data.usuarios || [],
        organizacionId
    });

    return await tarea.save();
};

const getTareasByOrganizacion = async (organizacionId: string): Promise<ITareaModel[]> => {
    if (!mongoose.Types.ObjectId.isValid(organizacionId)) {
        return [];
    }

    return await Tarea.find({ organizacionId }).populate({ path: 'usuarios', select: 'name' });
};

const updateTask = async (taskId: string, data: ITareaModel): Promise<ITareaModel | null> => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) return null;

    return await Tarea.findByIdAndUpdate(taskId, data).lean();
}

export default { createTareaByOrganizacion, getTareasByOrganizacion, updateTask };
