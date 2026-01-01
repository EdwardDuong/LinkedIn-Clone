using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Messages.Queries.GetConversationMessages;

public class GetConversationMessagesQueryHandler : IRequestHandler<GetConversationMessagesQuery, List<MessageDto>>
{
    private readonly IRepository<Message> _messageRepository;
    private readonly IRepository<Conversation> _conversationRepository;
    private readonly IMapper _mapper;

    public GetConversationMessagesQueryHandler(
        IRepository<Message> messageRepository,
        IRepository<Conversation> conversationRepository,
        IMapper mapper)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _mapper = mapper;
    }

    public async Task<List<MessageDto>> Handle(GetConversationMessagesQuery request, CancellationToken cancellationToken)
    {
        // Verify user is participant in conversation
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);
        if (conversation == null ||
            (conversation.ParticipantOneId != request.UserId && conversation.ParticipantTwoId != request.UserId))
        {
            return new List<MessageDto>();
        }

        var messages = await _messageRepository.GetAllAsync(cancellationToken);
        var conversationMessages = messages
            .Where(m => m.ConversationId == request.ConversationId)
            .OrderBy(m => m.CreatedAt)
            .ToList();

        return _mapper.Map<List<MessageDto>>(conversationMessages);
    }
}
