using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Messages.Commands.SendMessage;

public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, MessageDto>
{
    private readonly IRepository<Message> _messageRepository;
    private readonly IRepository<Conversation> _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SendMessageCommandHandler(
        IRepository<Message> messageRepository,
        IRepository<Conversation> conversationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<MessageDto> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        // Find or create conversation
        var conversations = await _conversationRepository.GetAllAsync(cancellationToken);
        var conversation = conversations.FirstOrDefault(c =>
            (c.ParticipantOneId == request.SenderId && c.ParticipantTwoId == request.RecipientId) ||
            (c.ParticipantOneId == request.RecipientId && c.ParticipantTwoId == request.SenderId));

        if (conversation == null)
        {
            conversation = new Conversation
            {
                Id = Guid.NewGuid(),
                ParticipantOneId = request.SenderId,
                ParticipantTwoId = request.RecipientId,
                LastMessageAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _conversationRepository.AddAsync(conversation, cancellationToken);
        }

        // Create message
        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            SenderId = request.SenderId,
            RecipientId = request.RecipientId,
            Content = request.Content,
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _messageRepository.AddAsync(message, cancellationToken);

        // Update conversation last message time
        conversation.LastMessageAt = DateTime.UtcNow;
        conversation.UpdatedAt = DateTime.UtcNow;
        await _conversationRepository.UpdateAsync(conversation, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<MessageDto>(message);
    }
}
