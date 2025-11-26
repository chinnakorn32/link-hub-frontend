import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface DeleteConfirmModalProps {
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

/**
 * Reusable delete confirmation modal
 */
const DeleteConfirmModal = {
    show: ({ title, content, onConfirm, onCancel }: DeleteConfirmModalProps) => {
        Modal.confirm({
            title,
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            content,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: onConfirm,
            onCancel,
            centered: true,
        });
    },
};

export default DeleteConfirmModal;
