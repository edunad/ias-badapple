local apple = apple or {}
apple.frames = {}
apple.buffer = {}
apple.width = 60
apple.height = 40
apple.frameRate = 15

function parse(data)
    apple.data = data

    -- Calculate all frames
    apple.frames = {}
    for i, frame in pairs(string.split(data, "/")) do
        table.insert(apple.frames, frame)
    end

    -- Setup first buffer
    apple.buffer = {}
    for y = 1, apple.height - 1 do
        for x = 1, apple.width - 1 do
            apple.buffer[x.."-"..y] = true
        end
    end

    print("=== Done")
end

function sendToJS(str)
    if not apple.panel then return end
    apple.panel:query("LISTENER_APPLE_DATA", {data = str})
end

function getBuffer(x, y)
    return apple.buffer[x.."-"..y]
end

function play()
    stop()

	timer:create("badApple", 1 / apple.frameRate, -1, function()
        local message = ""
        local rawData = table.remove(apple.frames, 1)
        local data = string.split(rawData, ":")

        -- Insert into buffer
        for i, v in pairs(data) do
            if v == "" then goto loop_end end
            local x, y = tonumber(v) % apple.width, math.floor(tonumber(v) / apple.width )
            local key = x.."-"..y

            apple.buffer[key] = not apple.buffer[key]
            ::loop_end::
        end

        -- Render
        for y = 1, apple.height - 1 do
            for x = 1, apple.width - 1 do
                local char = "⠀"

                if getBuffer(x, y) then
                    --[[

                    char = "⠿"
                    if not getBuffer(x + 1, y) then char = "⠸"
                    elseif not getBuffer(x - 1, y) then char = "⠇"
                    elseif not getBuffer(x, y - 1) then char = "⠤"
                    elseif not getBuffer(x - 1, y - 1) then char = "⠠"
                    elseif not getBuffer(x + 1, y + 1) then char = "⠁"
                    elseif not getBuffer(x, y + 1) then char = "⠉" end]]--

                    char = "#"
                end

                message = message .. char
            end

            message = message .. "\n"
        end

        sendToJS(message)
        if #apple.frames <= 0 then stop() end
    end)
end

function stop()
    if not timer:exists("badApple") then return end
    timer:destroy("badApple")
end

function Mod:init()
    print("[TESTMOD]: init")

    UI:registerMenu("ui_apple", "ui/ui_apple")
    http:fetch("https://ams3.digitaloceanspaces.com/failcake/public/badapple/caw.txt", {METHOD = "GET"}, function(err, data)
        if err then print("ERROR") end
        print("=== Parsing bad-apple frames")
        parse(data.data)
    end)
end

function Mod:onStateStart(state)
    if state ~= "ingame" then return end

    apple.panel = UI:createMenu("ui_apple")
    apple.panel:setSize(332, 495)
    apple.panel:setPos(50, 50)
    --apple.panel:setPos((UI:width() - 332) / 2,(UI:height() - 495) / 2)
    apple.panel:addEvent("ui_sound_ready", function(data)
        play()
        return {}
    end)
end

function Mod:onStateEnd(state)
    if apple.panel then apple.panel:remove() end
end