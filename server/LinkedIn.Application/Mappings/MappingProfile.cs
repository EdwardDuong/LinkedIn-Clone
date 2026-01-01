using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Domain.Entities;

namespace LinkedIn.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<ApplicationUser, UserDto>();
        CreateMap<ApplicationUser, PublicUserDto>();

        // Post mappings
        CreateMap<Post, PostDto>()
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User));

        // Comment mappings
        CreateMap<Comment, CommentDto>()
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User));

        // Connection mappings
        CreateMap<Connection, ConnectionDto>();

        // Notification mappings
        CreateMap<Notification, Features.Notifications.Queries.GetUserNotifications.NotificationDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

        // Message mappings
        CreateMap<Message, MessageDto>();
        CreateMap<Conversation, ConversationDto>();
    }
}
