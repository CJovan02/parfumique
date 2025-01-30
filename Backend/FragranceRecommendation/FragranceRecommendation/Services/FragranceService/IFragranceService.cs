﻿namespace FragranceRecommendation.Services.FragranceService;

public interface IFragranceService
{
    public Task<bool> FragranceExistsAsync(int id);
    public Task<bool> FragranceExistsAsync(string name);
    public Task<bool> FragranceHasManufacturerAsync(int id);
    public Task<IList<Fragrance>> GetFragrancesAsync();
    public Task<PaginationResponseDto> GetFragrancesAsyncPagination(int pageNumber, int pageSize);
    public Task<IList<Fragrance>> GetFragrancesWithouthManufacturerAsync();
    public Task<Fragrance?> GetFragranceAsync(int id);
    public Task AddFragranceAsync(AddFragranceDto fragrance);
    public Task UpdateFragranceAsync(UpdateFragranceDto fragrance);
    public Task AddNotesToFragrance(NotesToFragranceDto dto);
    public Task DeleteNotesFromFragrance(NotesToFragranceDto dto);
    public Task DeleteFragranceAsync(int id);
    public Task<List<FragranceRecommendationDto>> RecommendFragrance(int fragranceId, string username);
}