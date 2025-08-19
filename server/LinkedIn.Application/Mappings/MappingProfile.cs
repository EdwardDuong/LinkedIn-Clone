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
    }
}
