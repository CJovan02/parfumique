﻿namespace FragranceRecommendation.Services.FragranceService;

public class FragranceService(IDriver driver) : IFragranceService
{
    public async Task<bool> FragranceExistsAsync(int id)
    {
        await using var session = driver.AsyncSession();
        return await session.ExecuteReadAsync(async tx =>
        {
            var query = @"OPTIONAL MATCH (n:FRAGRANCE)
                          WHERE id(n) = $id
                          RETURN n IS NOT NULL AS exists";
            var result = await tx.RunAsync(query, new { id });
            return (await result.SingleAsync())["exists"].As<bool>();
        });
    }

    public async Task<IList<INode>> GetFragrancesAsync()
    {
        await using var session = driver.AsyncSession();
        return await session.ExecuteReadAsync(async tx =>
        {
            var result = await tx.RunAsync("MATCH (n:FRAGRANCE) RETURN n");
            var nodes = new List<INode>();
            await foreach (var record in result)
            {
                var node = record["n"].As<INode>();
                nodes.Add(node);
            }
            return nodes;
        });
    }
    
    public async Task<(int, int, int, IList<INode>)> GetFragrancesAsyncPagination(int pageNumber, int pageSize)
    {
        await using var session = driver.AsyncSession();
        int skip = pageSize * (pageNumber - 1);
        var totalCount = (await GetFragrancesAsync()).Count;
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var fragrances = await session.ExecuteReadAsync(async tx =>
        {
            var result = await tx.RunAsync("MATCH (n:FRAGRANCE) RETURN n SKIP $skip LIMIT $limit",
                new { skip, limit = pageSize });
            var nodes = new List<INode>();
            await foreach (var record in result)
            {
                var node = record["n"].As<INode>();
                nodes.Add(node);
            }
            return nodes;
        });
        return (skip, totalCount, totalPages, fragrances);
    }

    public async Task<IList<Fragrance>> GetFragrancesWithouthManufacturerAsync()
    {
        await using var session = driver.AsyncSession();
        return await session.ExecuteReadAsync(async tx =>
        {
            var query = @"MATCH (n:FRAGRANCE) 
                          WHERE NOT (n) <-[:MANUFACTURES]- (:MANUFACTURER)  
                          RETURN n{.*, id: id(n)} AS fragrance";
            var result = await tx.RunAsync(query);
            var records = await result.ToListAsync();
            return records.Select(record =>
                    JsonConvert.DeserializeObject<Fragrance>(JsonConvert.SerializeObject(record["fragrance"])))
                .Cast<Fragrance>()
                .ToList();
        });
    }

    public async Task<Fragrance> GetFragranceAsync(int id)
    {
        await using var session = driver.AsyncSession();
        return await session.ExecuteWriteAsync(async tx =>
        {
            var query = @"MATCH (n:FRAGRANCE)
                              WHERE id(n) = $id
                              OPTIONAL MATCH (n) <-[:MANUFACTURES]- (m:MANUFACTURER)
                              OPTIONAL MATCH (n) <-[:CREATES]- (p:PERFUMER)
                              OPTIONAL MATCH (n) -[:TOP]-> (t:NOTE)
                              OPTIONAL MATCH (n) -[:MIDDLE]-> (k:NOTE)
                              OPTIONAL MATCH (n) -[:BASE]-> (b:NOTE)
                              RETURN n{.*, id: id(n)} AS fragrance, m AS manufacturer, COLLECT(DISTINCT p{.*, id: id(p)}) AS perfumers, COLLECT(DISTINCT t) AS topNotes, COLLECT(DISTINCT k) AS middleNotes, COLLECT(DISTINCT b) AS baseNotes";
            var result = await tx.RunAsync(query, new { id });
            var record = await result.PeekAsync();
            var manufacturerNode = record["manufacturer"].As<INode>();
            var manufacturer = manufacturerNode != null
                ? JsonConvert.DeserializeObject<Manufacturer>(Helper.GetJson(manufacturerNode))
                : null;
            
            var perfumers =
                JsonConvert.DeserializeObject<List<Perfumer>>(JsonConvert.SerializeObject(record["perfumers"]));
            var topNotes = record["topNotes"].As<List<INode>>()
                .Select(node => JsonConvert.DeserializeObject<Note>(Helper.GetJson(node))).ToList();
            var middleNotes = record["middleNotes"].As<List<INode>>()
                .Select(node => JsonConvert.DeserializeObject<Note>(Helper.GetJson(node))).ToList();
            var baseNotes = record["baseNotes"].As<List<INode>>()
                .Select(node => JsonConvert.DeserializeObject<Note>(Helper.GetJson(node))).ToList();

            var fragrance =
                JsonConvert.DeserializeObject<Fragrance>(JsonConvert.SerializeObject(record["fragrance"]));
            fragrance!.Manufacturer = manufacturer;
            fragrance.Perfumers = perfumers!;
            fragrance.Top = topNotes!;
            fragrance.Middle = middleNotes!;
            fragrance.Base = baseNotes!;
            return fragrance;
        });
    }

    public async Task AddFragranceAsync(AddFragranceDto fragrance)
    {
        await using var session = driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = @"CREATE (:FRAGRANCE {name: $name, year: $year, gender: $gender, image: ''})";
            await tx.RunAsync(query,
                new { name = fragrance.Name, year = fragrance.BatchYear, gender = fragrance.Gender });
        });
    }

    public async Task UpdateFragranceAsync(UpdateFragranceDto fragrance)
    {
        await using var session = driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = @"MATCH (n:FRAGRANCE)
                          WHERE id(n) = $id
                          SET n.name = $name, n.year = $year, n.gender = $gender";
            await tx.RunAsync(query,
                new { id=fragrance.Id, name = fragrance.Name, year = fragrance.BatchYear, gender = fragrance.Gender });
        });
    }

    public async Task DeleteFragranceAsync(DeleteFragranceDto fragrance)
    {
        await using var session = driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = @"MATCH (n:FRAGRANCE)
                        WHERE id(n) = $id
                        DETACH DELETE (n)";
            await tx.RunAsync(query, new { id = fragrance.Id });
        });
    }
}