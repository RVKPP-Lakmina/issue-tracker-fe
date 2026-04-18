'use client';

import { useIssueStore } from '@/lib/store/issueStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IssueForm } from './IssueForm';
import { IssueDetail } from './IssueDetail';
import { useDeleteIssue } from '@/lib/hooks/useApi';

export function IssueModals() {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    isDeleteConfirmOpen,
    selectedIssue,
    closeCreateModal,
    closeEditModal,
    closeDetailModal,
    closeDeleteConfirm,
  } = useIssueStore();

  const { mutate: deleteIssue } = useDeleteIssue();

  const handleDeleteConfirm = () => {
    if (selectedIssue) {
      deleteIssue(selectedIssue.id, {
        onSuccess: () => {
          closeDeleteConfirm();
        },
      });
    }
  };

  return (
    <>
      {/* Create Issue Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Issue</DialogTitle>
            <DialogDescription>
              Add a new issue to track. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <IssueForm />
        </DialogContent>
      </Dialog>

      {/* Edit Issue Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogDescription>
              Update the issue details below.
            </DialogDescription>
          </DialogHeader>
          {selectedIssue && <IssueForm issue={selectedIssue} />}
        </DialogContent>
      </Dialog>

      {/* Issue Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={closeDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && <IssueDetail issue={selectedIssue} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={closeDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedIssue?.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
