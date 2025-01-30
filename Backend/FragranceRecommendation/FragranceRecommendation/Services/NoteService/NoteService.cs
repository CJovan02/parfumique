﻿namespace FragranceRecommendation.Services.NoteService;

public class NoteService(IDriver driver) : INoteService
{
    public async Task<bool> NoteExistsAsync(string name)
    {
        await using var session = driver.AsyncSession();
        return await session.ExecuteReadAsync(async tx =>
        {
            var query = @"OPTIONAL MATCH (n:NOTE {name: $name})
                          RETURN n IS NOT NULL AS exists";
            var result = await tx.RunAsync(query, new { name });
            return (await result.SingleAsync())["exists"].As<bool>();
        });
    }

    public async Task<IList<Note>> GetNotesAsync()
    {
        await using var session = driver.AsyncSession();
        return await session.ExecuteReadAsync(async tx =>
        {
            var result = await tx.RunAsync("MATCH (n:NOTE) RETURN n");
            var list = new List<Note>();
            await foreach (var record in result)
            {
                list.Add(MyUtils.DeserializeNode<Note>(record["n"].As<INode>()));
            }
            return list;
        });
    }

    public async Task<Note?> GetNoteAsync(string name)
    {
        await using var session = driver.AsyncSession();
        return await session.ExecuteReadAsync(async tx =>
        {
            var result = await tx.RunAsync(@"MATCH (n:NOTE {name: $name}) RETURN n", new { name });
            var record = await result.PeekAsync();
            return record is null ? null : MyUtils.DeserializeNode<Note>(record["n"].As<INode>());
        });
    }

    public async Task AddNoteAsync(AddNoteDto note)
    {
        await using var session = driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = @"CREATE (:NOTE {name: $name, type: $type})";
            await tx.RunAsync(query, new { name = note.Name, type = note.Type });
        });
    }

    public async Task UpdateNoteAsync(UpdateNoteDto note)
    {
        await using var session = driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            await tx.RunAsync("MATCH (n:NOTE {name: $name}) SET n.type = $type",
                new { name = note.Name, type = note.Type });
        });
    }

    public async Task DeleteNoteAsync(DeleteNoteDto note)
    {
        await using var session = driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = @"MATCH (n:NOTE {name: $name})
                          DETACH DELETE n";
            await tx.RunAsync(query, new { name = note.Name });
        });
    }
}