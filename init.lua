if SERVER then return end

local apple = apple or {}
apple.frames = {}
apple.buffer = {}
apple.width = 60 -- 128 -- 60
apple.height = 40 -- 96 -- 40
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
            apple.buffer[x.."-"..y] = false
        end
    end

    print("=== Done")
end

function getBuffer(x, y)
    return apple.buffer[x.."-"..y]
end

function playAnimation()
    stopAnimation()

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
				local char = " "
				if getBuffer(x, y) then char = "#" end
                message = message .. char
            end

            message = message .. "\n"
        end

		if apple.label and apple.label:isValid() then
			apple.label:setText(message)
		end

        if #apple.frames <= 0 then stopAnimation() end
    end)
end

function stopAnimation()
    if not timer:exists("badApple") then return end
    timer:destroy("badApple")
end

function Mod:init()
    print("[bad-apple]: init")

    http:fetch("https://ams3.digitaloceanspaces.com/failcake/public/badapple/caw.txt", {METHOD = "GET"}, function(err, data)
        if err then print("ERROR") end
        print("=== Parsing bad-apple frames")
        parse(data.data)
    end)
end

function Mod:onLoad()
	print("[bad-apple] LOAD")
	resources:loadSound("content/apple.ogg")
end

function Mod:onStateStart(state)
    if state ~= "ingame" then return end

    apple.sound = resources:getSound("content/apple.ogg")
    apple.sound.volume = 0.3
	apple.sound:play()

    apple.panel = UI:create("frame")
	apple.panel:setPos(50, 50)
	apple.panel:setSize(390, 565)
	apple.panel:setTitle("Bad apple")
	apple.panel:setTitleColor(255, 255, 255)
	apple.panel:setDraggable(true)
	apple.panel:setClosable(true)
	apple.panel:onClose(function()
		if apple.sound and apple.sound:isValid() then apple.sound:stop() end
	end)

    apple.label = UI:create("label", apple.panel)
	apple.label:setFont("@/content/fonts/consola.ttf", 12)
	apple.label:setPos(0, 17)
	apple.label:setShadowColor(1, 1, 1)
	apple.label:setColor(255, 255, 255)
	apple.label:setSize(408, 565)

	print("[bad-apple] START")
    playAnimation()
end

function Mod:onStateEnd(state)
    if apple.panel and apple.panel:isValid() then apple.panel:remove() end
    if apple.sound and apple.sound:isValid() then apple.sound:stop() end
end