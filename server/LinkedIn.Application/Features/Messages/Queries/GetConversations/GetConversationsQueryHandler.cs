using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Messages.Queries.GetConversations;

public class GetConversationsQueryHandler : IRequestHandler<GetConversationsQuery, List<ConversationDto>>
{
    private readonly IRepository<Conversation> _conversationRepository;
    private readonly IRepository<Message> _messageRepository;
    private readonly IRepository<ApplicationUser> _userRepository;
    private readonly IMapper _mapper;

    public GetConversationsQueryHandler(
        IRepository<Conversation> conversationRepository,
        IRepository<Message> messageRepository,
        IRepository<ApplicationUser> userRepository,
        IMapper mapper)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<List<ConversationDto>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
    {
        var conversations = await _conversationRepository.GetAllAsync(cancellationToken);
        var userConversations = conversations
            .Where(c => c.ParticipantOneId == request.UserId || c.ParticipantTwoId == request.UserId)
            .ToList();

        var result = new List<ConversationDto>();

        foreach (var conversation in userConversations)
        {
            var otherUserId = conversation.ParticipantOneId == request.UserId
                ? conversation.ParticipantTwoId
                : conversation.ParticipantOneId;

            var otherUser = await _userRepository.GetByIdAsync(otherUserId, cancellationToken);
            if (otherUser == null) continue;

            var messages = await _messageRepository.GetAllAsync(cancellationToken);
            var conversationMessages = messages
                .Where(m => m.ConversationId == conversation.Id)
                .OrderByDescending(m => m.CreatedAt)
                .ToList();

            var lastMessage = conversationMessages.FirstOrDefault();
            var unreadCount = conversationMessages.Count(m => m.RecipientId == request.UserId && !m.IsRead);

            result.Add(new ConversationDto
            {
                Id = conversation.Id,
                OtherUser = _mapper.Map<PublicUserDto>(otherUser),
                LastMessage = lastMessage != null ? _mapper.Map<MessageDto>(lastMessage) : null,
                LastMessageAt = conversation.LastMessageAt,
                UnreadCount = unreadCount
            });
        }

        return result.OrderByDescending(c => c.LastMessageAt).ToList();
    }
}
