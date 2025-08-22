using FluentValidation;

namespace LinkedIn.Application.Features.FileUpload.Commands.UploadFile;

public class UploadFileCommandValidator : AbstractValidator<UploadFileCommand>
{
    public UploadFileCommandValidator()
    {
        RuleFor(x => x.File)
            .NotNull().WithMessage("File is required")
            .Must(file => file?.Length > 0).WithMessage("File cannot be empty");

        RuleFor(x => x.Folder)
            .NotEmpty().WithMessage("Folder is required")
            .MaximumLength(50).WithMessage("Folder name cannot exceed 50 characters");
    }
}
